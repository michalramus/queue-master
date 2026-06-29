"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { updateUserSettings, useUserSettings, type UserSettingsInterface } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { Modal, Checkbox, Button, Spinner, InfoTooltip } from "shared-components";
import { showToast } from "@/utils/toast";

interface UserSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserSettingsModal({ isOpen, onClose }: UserSettingsModalProps) {
    const t = useTranslations();
    const queryClient = useQueryClient();

    const { data: serverSettings, isLoading } = useUserSettings(axiosAuthInstance, undefined, {
        enabled: isOpen,
    });

    const [settings, setSettings] = useState<UserSettingsInterface>({});
    const [notificationPermission, setNotificationPermission] =
        useState<NotificationPermission | null>(null);

    // Update local settings state when server settings are loaded
    useEffect(() => {
        if (serverSettings) {
            setSettings(serverSettings);
        }
    }, [serverSettings]);

    const saveMutation = useMutation({
        mutationFn: () => updateUserSettings(settings, axiosAuthInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userSettings"] });
            showToast.success(t("settings_updated_successfully"));
            onClose();
        },
        onError: (error: unknown) => {
            const message = (error as { response?: { data?: { message?: string } } }).response?.data
                ?.message;
            showToast.error(message ?? t("failed_load_user_settings"));
        },
    });

    return (
        <Modal hidden={!isOpen} color="background">
            <div className="w-full max-w-md p-6">
                <p className="text-text-1 mb-6 text-xl font-bold">{t("user_settings")}</p>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Spinner label={t("loading")} />
                        <span className="text-text-2 ml-3">{t("loading")}</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-start gap-2">
                            <Checkbox
                                id="notifications_on"
                                label={t("notifications_on")}
                                checked={settings.notifications_on ?? true}
                                onChange={(e) =>
                                    setSettings({ ...settings, notifications_on: e.target.checked })
                                }
                                hint={t("notifications_on_description")}
                            />
                            <InfoTooltip
                                icon="i"
                                text={t("notifications_on_how_it_works")}
                                width="w-80"
                            />
                        </div>
                        {notificationPermission !== "granted" && (
                            <div>
                                <Button
                                    color="primary"
                                    onClick={() => {
                                        Notification.requestPermission().then((result) =>
                                            setNotificationPermission(result),
                                        );
                                    }}
                                >
                                    {t("request_notification_permission")}
                                </Button>
                                {notificationPermission === "denied" && (
                                    <p className="text-red-1 mt-1 text-xs">
                                        {t("notification_permission_denied")}
                                    </p>
                                )}
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
                        onClick={() => saveMutation.mutate()}
                        disabled={saveMutation.isPending || isLoading}
                        color="primary"
                        className="m-0! flex items-center"
                    >
                        {saveMutation.isPending && <Spinner size="sm" className="mr-2" />}
                        {saveMutation.isPending ? t("saving") : t("save")}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
