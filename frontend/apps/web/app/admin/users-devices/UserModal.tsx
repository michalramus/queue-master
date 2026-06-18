"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
    createUser,
    updateUser,
    updateUserPassword,
    updateUserSettings,
    useUserSettings,
    useAuthInfo,
    useDesks,
    type UserResponseDto,
    type UserCreateDto,
    type UserUpdateDto,
    type UserPasswordUpdateDto,
    type UserSettingsInterface,
    type UserRole,
} from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import {
    Modal,
    Spinner,
    Button,
    Checkbox,
    Input,
    Select,
    TabNav,
    TextButton,
} from "shared-components";
import { showToast } from "@/utils/toast";

type UserModalTab = "edit" | "settings";

interface UserModalProps {
    isOpen: boolean;
    editingUser: UserResponseDto | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function UserModal({ isOpen, editingUser, onClose, onSuccess }: UserModalProps) {
    const t = useTranslations();
    const queryClient = useQueryClient();

    const [userModalTab, setUserModalTab] = useState<UserModalTab>("edit");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState<UserRole>("User");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordChangeMode, setPasswordChangeMode] = useState(false);
    const [settings, setSettings] = useState<UserSettingsInterface>({});
    const [settingsModified, setSettingsModified] = useState(false);
    const [defaultDeskId, setDefaultDeskId] = useState<number | null>(null);

    const { data: authInfo } = useAuthInfo(axiosAuthInstance, { enabled: true });
    const { data: desks = [] } = useDesks(axiosAuthInstance);

    const { data: serverUserSettings, isLoading: loadingSettings } = useUserSettings(
        axiosAuthInstance,
        editingUser?.id,
        { enabled: !!editingUser },
    );

    // Initialize form
    useEffect(() => {
        if (!isOpen) return;
        setUserModalTab("edit");
        setPasswordChangeMode(false);
        setNewPassword("");
        setSettingsModified(false);
        if (!editingUser) {
            setUsername("");
            setPassword("");
            setRole("User");
            setSettings({});
            setDefaultDeskId(null);
        } else {
            setUsername(editingUser.username);
            setRole(editingUser.role);
            setDefaultDeskId(editingUser.default_desk?.id ?? null);
        }
    }, [isOpen, editingUser]);

    useEffect(() => {
        if (serverUserSettings) {
            setSettings(serverUserSettings);
        }
    }, [serverUserSettings]);

    const saveMutation = useMutation({
        mutationFn: async () => {
            if (editingUser) {
                const updateDto: UserUpdateDto = {
                    username: username,
                    role: role,
                    default_desk_id: defaultDeskId,
                };
                await updateUser(axiosAuthInstance, editingUser.id, updateDto);

                if (passwordChangeMode) {
                    const passwordDto: UserPasswordUpdateDto = { password: newPassword };
                    await updateUserPassword(axiosAuthInstance, editingUser.id, passwordDto);
                }

                if (settingsModified && !loadingSettings) {
                    await updateUserSettings(settings, axiosAuthInstance, editingUser.id);
                }
            } else {
                const createDto: UserCreateDto = {
                    username: username,
                    password: password,
                    role: role,
                    default_desk_id: defaultDeskId ?? undefined,
                };
                createDto.settings = settings;
                await createUser(axiosAuthInstance, createDto);
            }
        },
        onSuccess: () => {
            if (editingUser) {
                if (passwordChangeMode) showToast.success(t("password_updated_successfully"));
                queryClient.invalidateQueries({ queryKey: ["userSettings", editingUser.id] });
                queryClient.invalidateQueries({ queryKey: ["users"] });
                showToast.success(t("user_updated_successfully"));
            } else {
                queryClient.invalidateQueries({ queryKey: ["users"] });
                showToast.success(t("user_created_successfully"));
            }
            onSuccess();
            onClose();
        },
        onError: (error: unknown) => {
            const message = (error as { response?: { data?: { message?: string } } }).response?.data
                ?.message;
            showToast.error(message ?? t("failed_save_user"));
        },
    });

    const isCurrentUser = editingUser?.id === authInfo?.id && editingUser?.role === "Admin";

    return (
        <Modal hidden={!isOpen} color="background">
            <div className="w-full max-w-2xl p-6">
                <p className="text-text-1 mb-4 text-xl font-bold">
                    {editingUser ? t("edit_user") : t("create_user")}
                </p>
                {editingUser && (
                    <TabNav
                        className="mb-6"
                        tabs={[
                            { key: "edit", label: t("user_info") },
                            { key: "settings", label: t("settings") },
                        ]}
                        activeTab={userModalTab}
                        onChange={(key) => setUserModalTab(key)}
                    />
                )}
                {userModalTab === "edit" && (
                    <div className="space-y-4">
                        <Input
                            label={t("username")}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {!editingUser && (
                            <>
                                <Input
                                    label={t("password")}
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Select
                                    label={t("desk")}
                                    value={defaultDeskId !== null ? String(defaultDeskId) : ""}
                                    onChange={(val) => setDefaultDeskId(val ? Number(val) : null)}
                                    hint={t("desk_setting_description")}
                                >
                                    <option value="">{t("no_desk")}</option>
                                    {desks.map((desk) => (
                                        <option key={desk.id} value={String(desk.id)}>
                                            {desk.desk_name} (#{desk.desk_number})
                                        </option>
                                    ))}
                                </Select>
                                <Checkbox
                                    id="notifications_on_create"
                                    label={t("notifications_on")}
                                    checked={settings.notifications_on ?? true}
                                    onChange={(e) => {
                                        setSettings({
                                            ...settings,
                                            notifications_on: e.target.checked,
                                        });
                                        setSettingsModified(true);
                                    }}
                                    hint={t("notifications_on_description")}
                                />
                            </>
                        )}
                        <div>
                            <Select
                                label={t("role")}
                                value={role}
                                onChange={(value) => setRole(value)}
                            >
                                <option value="User" disabled={isCurrentUser}>
                                    {t("user")}
                                </option>
                                <option value="Admin">{t("admin")}</option>
                            </Select>
                            {isCurrentUser && (
                                <p className="mt-1 text-xs text-amber-600">
                                    {t("cannot_change_own_admin_role")}
                                </p>
                            )}
                        </div>
                        {editingUser && (
                            <div className="border-gray-1 bg-background rounded border p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-text-2 text-sm font-medium">
                                        {t("change_password")}
                                    </label>
                                    <TextButton
                                        onClick={() => {
                                            setPasswordChangeMode(!passwordChangeMode);
                                            setNewPassword("");
                                        }}
                                        color="blue"
                                        className="text-xs"
                                    >
                                        {passwordChangeMode ? t("cancel") : t("change")}
                                    </TextButton>
                                </div>
                                {passwordChangeMode && (
                                    <Input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder={t("new_password_placeholder")}
                                    />
                                )}
                                {passwordChangeMode &&
                                    newPassword.length > 0 &&
                                    newPassword.length < 6 && (
                                        <p className="text-red-1 mt-1 text-xs">
                                            {t("password_min_length")}
                                        </p>
                                    )}
                            </div>
                        )}
                    </div>
                )}
                {userModalTab === "settings" && editingUser && (
                    <div className="space-y-4">
                        {loadingSettings ? (
                            <div className="flex items-center justify-center py-8">
                                <Spinner label={t("loading")} />
                                <span className="text-text-2 ml-3">{t("loading")}</span>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Select
                                    label={t("desk")}
                                    value={defaultDeskId !== null ? String(defaultDeskId) : ""}
                                    onChange={(val) => setDefaultDeskId(val ? Number(val) : null)}
                                    hint={t("desk_setting_description")}
                                >
                                    <option value="">{t("no_desk")}</option>
                                    {desks.map((desk) => (
                                        <option key={desk.id} value={String(desk.id)}>
                                            {desk.desk_name} (#{desk.desk_number})
                                        </option>
                                    ))}
                                </Select>
                                <Checkbox
                                    id="notifications_on"
                                    label={t("notifications_on")}
                                    checked={settings.notifications_on ?? true}
                                    onChange={(e) => {
                                        setSettings({
                                            ...settings,
                                            notifications_on: e.target.checked,
                                        });
                                        setSettingsModified(true);
                                    }}
                                    hint={t("notifications_on_description")}
                                />
                            </div>
                        )}
                    </div>
                )}
                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        onClick={onClose}
                        disabled={saveMutation.isPending}
                        color="gray"
                        className="m-0!"
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        onClick={() => {
                            if (!username.trim()) {
                                showToast.error(t("username_required"));
                                return;
                            }
                            if (!editingUser && password.length < 6) {
                                showToast.error(t("password_min_length"));
                                return;
                            }
                            if (editingUser && passwordChangeMode && newPassword.length < 6) {
                                showToast.error(t("password_min_length"));
                                return;
                            }
                            saveMutation.mutate();
                        }}
                        disabled={saveMutation.isPending}
                        color="primary"
                        className="m-0! flex items-center text-white"
                    >
                        {saveMutation.isPending && (
                            <Spinner size="sm" className="mr-2 text-white" />
                        )}
                        {saveMutation.isPending ? t("saving") : t("save")}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
