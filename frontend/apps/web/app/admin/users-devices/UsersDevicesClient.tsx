"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
    updateDevice,
    deleteDevice,
    deleteUser,
    useUsers,
    useDevices,
    useAllUsersSettings,
    type UserResponseDto,
    type DeviceResponseDto,
} from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { ConfirmModal, Button, TabNav } from "shared-components";
import { showToast } from "@/utils/toast";
import { PageHeader } from "@/components/admin";
import UsersTable from "./UsersTable";
import DevicesTable from "./DevicesTable";
import UserModal from "./UserModal";
import DeviceCreateModal from "./DeviceCreateModal";
import DeviceEditModal from "./DeviceEditModal";

export default function UsersDevicesClient() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    const { data: users = [] } = useUsers(axiosAuthInstance);
    const { data: devices = [] } = useDevices(axiosAuthInstance);
    const { data: allUsersSettings = {} } = useAllUsersSettings(axiosAuthInstance);

    const [activeTab, setActiveTab] = useState<"users" | "devices">("users");
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserResponseDto | null>(null);
    const [createDeviceModalOpen, setCreateDeviceModalOpen] = useState(false);
    const [editDeviceModalOpen, setEditDeviceModalOpen] = useState(false);
    const [editingDevice, setEditingDevice] = useState<DeviceResponseDto | null>(null);

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        type?: "danger" | "warning" | "info" | "primary";
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {},
        type: "primary",
    });

    const deleteUserMutation = useMutation({
        mutationFn: (userId: number) => deleteUser(axiosAuthInstance, userId),
        onSuccess: () => {
            showToast.success(t("user_deleted_successfully"));
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["allUsersSettings"] });
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            showToast.error(err.response?.data?.message || t("failed_save_user"));
        },
    });

    const toggleDeviceMutation = useMutation({
        mutationFn: ({ deviceId, accepted }: { deviceId: number; accepted: boolean }) =>
            updateDevice(axiosAuthInstance, deviceId, { accepted }),
        onSuccess: () => {
            showToast.success(t("device_updated_successfully"));
            queryClient.invalidateQueries({ queryKey: ["devices"] });
        },
        onError: () => {
            showToast.error(t("failed_update_device"));
        },
    });

    const deleteDeviceMutation = useMutation({
        mutationFn: (deviceId: number) => deleteDevice(axiosAuthInstance, deviceId),
        onSuccess: () => {
            showToast.success(t("device_deleted_successfully"));
            queryClient.invalidateQueries({ queryKey: ["devices"] });
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            showToast.error(err.response?.data?.message || t("failed_update_device"));
        },
    });

    function handleCreateUser() {
        setEditingUser(null);
        setUserModalOpen(true);
    }

    function handleEditUser(user: UserResponseDto) {
        setEditingUser(user);
        setUserModalOpen(true);
    }

    function handleUserSuccess() {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["allUsersSettings"] });
    }

    function handleDeleteUser(userId: number) {
        setConfirmModal({
            isOpen: true,
            title: t("are_you_sure"),
            message: t("are_you_sure_delete_user") + " " + t("action_cannot_be_undone"),
            type: "danger",
            onConfirm: () => {
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                deleteUserMutation.mutate(userId);
            },
        });
    }

    function handleToggleDevice(deviceId: number, accepted: boolean) {
        toggleDeviceMutation.mutate({ deviceId, accepted });
    }

    function handleEditDevice(device: DeviceResponseDto) {
        setEditingDevice(device);
        setEditDeviceModalOpen(true);
    }

    function handleDeleteDevice(deviceId: number) {
        setConfirmModal({
            isOpen: true,
            title: t("are_you_sure"),
            message: t("are_you_sure_delete_device") + " " + t("action_cannot_be_undone"),
            type: "danger",
            onConfirm: () => {
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                deleteDeviceMutation.mutate(deviceId);
            },
        });
    }

    return (
        <div>
            <PageHeader
                title={t("users_and_devices_management")}
                action={
                    activeTab === "users" ? (
                        <Button onClick={handleCreateUser} color="primary" className="m-0!">
                            + {t("add_user")}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setCreateDeviceModalOpen(true)}
                            color="primary"
                            className="m-0!"
                        >
                            + {t("add_device")}
                        </Button>
                    )
                }
            />

            <TabNav
                className="mb-6"
                tabs={[
                    { key: "users", label: `${t("users")} (${users.length})` },
                    { key: "devices", label: `${t("devices")} (${devices.length})` },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === "users" && (
                <UsersTable
                    users={users}
                    deleting={deleteUserMutation.isPending}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                />
            )}

            {activeTab === "devices" && (
                <DevicesTable
                    devices={devices}
                    deleting={deleteDeviceMutation.isPending}
                    onToggle={handleToggleDevice}
                    onEdit={handleEditDevice}
                    onDelete={handleDeleteDevice}
                />
            )}

            <UserModal
                isOpen={userModalOpen}
                editingUser={editingUser}
                onClose={() => setUserModalOpen(false)}
                onSuccess={handleUserSuccess}
            />

            <DeviceCreateModal
                isOpen={createDeviceModalOpen}
                onClose={() => setCreateDeviceModalOpen(false)}
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ["devices"] })}
            />

            {editingDevice && (
                <DeviceEditModal
                    isOpen={editDeviceModalOpen}
                    device={editingDevice}
                    onClose={() => {
                        setEditDeviceModalOpen(false);
                        setEditingDevice(null);
                    }}
                    onSuccess={() => queryClient.invalidateQueries({ queryKey: ["devices"] })}
                />
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={t("confirm")}
                cancelText={t("cancel")}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                type={confirmModal.type}
            />
        </div>
    );
}
