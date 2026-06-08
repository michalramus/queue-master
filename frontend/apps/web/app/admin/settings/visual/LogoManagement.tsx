"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogoID, deleteLogo, uploadLogo, useLogoAvailabilities } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { ConfirmModal, InfoTooltip } from "shared-components";
import { showToast } from "@/utils/toast";
import LogoCard from "./LogoCard";

export default function LogoManagement() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    const { data: availableLogos = [] } = useLogoAvailabilities(axiosPureInstance);

    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        type?: "danger" | "warning" | "info";
    } | null>(null);

    const uploadLogoMutation = useMutation({
        mutationFn: ({ logoId, file }: { logoId: LogoID; file: File }) =>
            uploadLogo(logoId, file, axiosAuthInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["logoAvailabilities"] });
            showToast.success(t("logo_uploaded_successfully"));
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            showToast.error(err.response?.data?.message || t("failed_upload_logo"));
        },
    });

    const deleteLogoMutation = useMutation({
        mutationFn: (logoId: LogoID) => deleteLogo(logoId, axiosAuthInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["logoAvailabilities"] });
            showToast.success(t("logo_deleted_successfully"));
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            showToast.error(err.response?.data?.message || t("failed_delete_logo"));
        },
    });

    function handleLogoDelete(logoId: LogoID) {
        setConfirmConfig({
            isOpen: true,
            title: t("are_you_sure"),
            message: t("are_you_sure_delete_logo") + " " + t("action_cannot_be_undone"),
            type: "danger",
            onConfirm: () => deleteLogoMutation.mutate(logoId),
        });
    }

    const uploadingLogoId = uploadLogoMutation.isPending
        ? uploadLogoMutation.variables?.logoId
        : null;

    return (
        <div className="rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-text-1 text-xl font-bold">{t("logo_management")}</h2>
                <InfoTooltip text={t("logo_description")} />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Object.values(LogoID).map((logoId) => (
                    <LogoCard
                        key={logoId}
                        logoId={logoId}
                        isAvailable={availableLogos.includes(logoId)}
                        isUploading={uploadingLogoId === logoId}
                        onUpload={(id, file) => uploadLogoMutation.mutate({ logoId: id, file })}
                        onDelete={handleLogoDelete}
                    />
                ))}
            </div>

            {confirmConfig && (
                <ConfirmModal
                    isOpen={confirmConfig.isOpen}
                    title={confirmConfig.title}
                    message={confirmConfig.message}
                    confirmText={t("confirm")}
                    cancelText={t("cancel")}
                    onConfirm={confirmConfig.onConfirm}
                    onCancel={() => setConfirmConfig(null)}
                    type={confirmConfig.type}
                />
            )}
        </div>
    );
}
