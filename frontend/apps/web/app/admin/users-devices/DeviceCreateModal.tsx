"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { registerDevice } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { Modal, Spinner, Button, Textarea } from "shared-components";
import { showToast } from "@/utils/toast";

interface DeviceCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function DeviceCreateModal({ isOpen, onClose, onSuccess }: DeviceCreateModalProps) {
    const t = useTranslations();
    const [deviceToken, setDeviceToken] = useState<string | null>(null);
    const [deviceComment, setDeviceComment] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setDeviceToken(null);
            setDeviceComment("");
        }
    }, [isOpen]);

    const registerMutation = useMutation({
        mutationFn: () => registerDevice(axiosAuthInstance, deviceComment || undefined),
        onSuccess: (response) => {
            setDeviceToken(response.data.jwt_token);
            showToast.success(t("device_created_successfully"));
            onSuccess();
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            showToast.error(err.response?.data?.message || t("failed_create_device"));
        },
    });

    return (
        <Modal hidden={!isOpen} color="background">
            <div className="w-full max-w-md p-6">
                <p className="text-text-1 mb-4 text-xl font-bold">{t("create_device")}</p>

                {!deviceToken ? (
                    <>
                        <p className="mb-4 text-gray-700">
                            {t("register_device_instruction_before_registration")}
                        </p>

                        <Textarea
                            className="mb-6"
                            label={`${t("comment")} (${t("optional")})`}
                            value={deviceComment}
                            onChange={(e) => setDeviceComment(e.target.value)}
                            maxLength={500}
                            rows={3}
                            placeholder={t("device_comment_placeholder")}
                        />

                        <div className="flex justify-end gap-3">
                            <Button
                                onClick={onClose}
                                disabled={registerMutation.isPending}
                                color="gray"
                                className="m-0!"
                            >
                                {t("cancel")}
                            </Button>
                            <Button
                                onClick={() => registerMutation.mutate()}
                                disabled={registerMutation.isPending}
                                color="primary"
                                className="m-0! flex items-center"
                            >
                                {registerMutation.isPending && (
                                    <Spinner size="sm" className="mr-2 text-white" />
                                )}
                                {registerMutation.isPending
                                    ? t("saving")
                                    : t("register_new_device")}
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                            <p className="mb-2 text-sm font-semibold text-yellow-800">
                                ⚠️ {t("device_token_warning")}
                            </p>
                            <p className="text-xs text-yellow-700">
                                {t("device_token_description")}
                            </p>
                        </div>

                        <div className="relative mb-6">
                            <Textarea
                                label={t("device_token")}
                                value={deviceToken}
                                readOnly
                                rows={4}
                                mono
                            />
                            <Button
                                onClick={() => {
                                    navigator.clipboard.writeText(deviceToken);
                                    showToast.success(t("copied_to_clipboard"));
                                }}
                                color="primary"
                                className="absolute top-6 right-2 m-0! px-3 py-1 text-xs shadow-none"
                            >
                                {t("copy")}
                            </Button>
                        </div>

                        <div className="flex justify-end">
                            <Button onClick={onClose} color="primary" className="m-0!">
                                {t("close")}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
