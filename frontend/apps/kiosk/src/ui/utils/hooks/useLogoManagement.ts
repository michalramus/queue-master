import { useEffect } from "react";
import { LangCode, LogoID, getLogoUrl, useLogoAvailabilities } from "shared-utils";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { useTranslation } from "react-i18next";
import { useAppConfig } from "@/utils/hooks/useAppConfig";

function getLangLogoUrl(
    logoAvailability: Record<string, LogoID[]> | undefined,
    logoId: LogoID,
    currentLang: LangCode,
    backendUrl: string | undefined,
): string | null {
    if (!backendUrl || !logoAvailability) return null;
    if (logoAvailability[currentLang]?.includes(logoId)) {
        return getLogoUrl(backendUrl, currentLang, logoId);
    }
    return null;
}

// Preloads logo images for all available languages to warm browser cache
function usePreloadLogos(
    logoAvailability: Record<LangCode, LogoID[]> | undefined,
    backendUrl: string | undefined,
): void {
    useEffect(() => {
        if (!logoAvailability || !backendUrl) return;
        for (const lang of Object.values(LangCode)) {
            const logoIds = logoAvailability[lang] ?? [];
            for (const logoId of logoIds) {
                const img = new Image();
                img.src = getLogoUrl(backendUrl, lang, logoId);
            }
        }
    }, [logoAvailability, backendUrl]);
}

export function useLogoManagement(
    mainLogoId: LogoID,
    secondaryLogoId: LogoID,
): { mainLogoUrl: string | null; secondaryLogoUrl: string | null; isLoading: boolean } {
    const { i18n } = useTranslation();
    const { data: appConfig } = useAppConfig();
    const { data: logoAvailability, isLoading } = useLogoAvailabilities(axiosPureInstance);

    usePreloadLogos(logoAvailability, appConfig?.backendUrl);

    const currentLang = i18n.language as LangCode;

    const mainLogoUrl = getLangLogoUrl(
        logoAvailability,
        mainLogoId,
        currentLang,
        appConfig?.backendUrl,
    );
    const secondaryLogoUrl = getLangLogoUrl(
        logoAvailability,
        secondaryLogoId,
        currentLang,
        appConfig?.backendUrl,
    );

    return { mainLogoUrl, secondaryLogoUrl, isLoading };
}
