"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    LangCode,
    LogoID,
    deleteLogo,
    uploadLogo,
    useLogoAvailabilities,
    useGlobalSettings,
} from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { ConfirmModal, InfoTooltip, TabNav } from "shared-components";
import { showToast } from "@/utils/toast";
import LogoCard from "./LogoCard";

export default function LogoManagement() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    const { data: globalSettings } = useGlobalSettings(axiosPureInstance);
    const defaultLang: LangCode = (globalSettings?.locale ?? LangCode.en) as LangCode;

    const [selectedLang, setSelectedLang] = useState<LangCode>(defaultLang);

    const { data: availableLogos } = useLogoAvailabilities(axiosPureInstance);

    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        type?: "danger" | "warning" | "info";
    } | null>(null);

    const uploadLogoMutation = useMutation({
        mutationFn: ({ lang, logoId, file }: { lang: LangCode; logoId: LogoID; file: File }) =>
            uploadLogo(lang, logoId, file, axiosAuthInstance),
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
        mutationFn: ({ lang, logoId }: { lang: LangCode; logoId: LogoID }) =>
            deleteLogo(lang, logoId, axiosAuthInstance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["logoAvailabilities"] });
            showToast.success(t("logo_deleted_successfully"));
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            showToast.error(err.response?.data?.message || t("failed_delete_logo"));
        },
    });

    function handleLogoDelete(lang: LangCode, logoId: LogoID) {
        setConfirmConfig({
            isOpen: true,
            title: t("are_you_sure"),
            message: t("are_you_sure_delete_logo") + " " + t("action_cannot_be_undone"),
            type: "danger",
            onConfirm: () => deleteLogoMutation.mutate({ lang, logoId }),
        });
    }

    const uploadingLogoId = uploadLogoMutation.isPending
        ? uploadLogoMutation.variables?.logoId
        : null;

    const langTabs = Object.values(LangCode).map((lang) => ({
        key: lang,
        label: lang.toUpperCase(),
    }));

    const activeLangLogos = availableLogos?.[selectedLang] ?? [];

    return (
        <div className="rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-text-1 text-xl font-bold">{t("logo_management")}</h2>
                <InfoTooltip text={t("logo_description")} />
            </div>
            <TabNav
                tabs={langTabs}
                activeTab={selectedLang}
                onChange={(lang) => setSelectedLang(lang)}
                className="mb-6"
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Object.values(LogoID).map((logoId) => (
                    <LogoCard
                        key={logoId}
                        lang={selectedLang}
                        logoId={logoId}
                        isAvailable={activeLangLogos.includes(logoId)}
                        isUploading={uploadingLogoId === logoId}
                        onUpload={(lang, id, file) =>
                            uploadLogoMutation.mutate({ lang, logoId: id, file })
                        }
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
