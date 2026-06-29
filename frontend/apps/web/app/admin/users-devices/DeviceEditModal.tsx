"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { updateDevice, type DeviceResponseDto } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { Modal, Spinner, Button, Textarea } from "shared-components";
import { showToast } from "@/utils/toast";

interface DeviceEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    device: DeviceResponseDto;
}

export default function DeviceEditModal({
    isOpen,
    onClose,
    onSuccess,
    device,
}: DeviceEditModalProps) {
    const t = useTranslations();
    const [deviceComment, setDeviceComment] = useState(device.comment ?? "");

    useEffect(() => {
        if (isOpen) {
            setDeviceComment(device.comment ?? "");
        }
    }, [isOpen, device]);

    const editMutation = useMutation({
        mutationFn: () => updateDevice(axiosAuthInstance, device.id, { comment: deviceComment }),
        onSuccess: () => {
            showToast.success(t("device_updated_successfully"));
            onSuccess();
            onClose();
        },
        onError: () => {
            showToast.error(t("failed_update_device"));
        },
    });

    return (
        <Modal hidden={!isOpen} color="background">
            <div className="w-full max-w-md p-6">
                <p className="text-text-1 mb-4 text-xl font-bold">{t("edit_device")}</p>

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
                        disabled={editMutation.isPending}
                        color="gray"
                        className="m-0!"
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        onClick={() => editMutation.mutate()}
                        disabled={editMutation.isPending}
                        color="primary"
                        className="m-0! flex items-center"
                    >
                        {editMutation.isPending && (
                            <Spinner size="sm" className="mr-2 text-white" />
                        )}
                        {editMutation.isPending ? t("saving") : t("save")}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
