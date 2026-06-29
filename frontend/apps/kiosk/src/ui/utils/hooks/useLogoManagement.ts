import { useEffect, useState } from "react";
import { LangCode, LogoID, getLogoUrl, sseEvents, useLogoAvailabilities } from "shared-utils";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { useTranslation } from "react-i18next";
import { useAppConfig } from "@/utils/hooks/useAppConfig";
import { useSse } from "@/utils/hooks/useSse";

function getLangLogoUrl(
    logoAvailability: Record<string, LogoID[]> | undefined,
    logoId: LogoID,
    currentLang: LangCode,
    backendUrl: string | undefined,
    cacheBuster: number,
): string | null {
    if (!backendUrl || !logoAvailability) return null;
    if (logoAvailability[currentLang]?.includes(logoId)) {
        return `${getLogoUrl(backendUrl, currentLang, logoId)}?v=${cacheBuster}`;
    }
    return null;
}

// Preloads logo images for all available languages to warm browser cache
function usePreloadLogos(
    logoAvailability: Record<LangCode, LogoID[]> | undefined,
    backendUrl: string | undefined,
    cacheBuster: number,
): void {
    useEffect(() => {
        if (!logoAvailability || !backendUrl) return;
        for (const lang of Object.values(LangCode)) {
            const logoIds = logoAvailability[lang] ?? [];
            for (const logoId of logoIds) {
                const img = new Image();
                img.src = `${getLogoUrl(backendUrl, lang, logoId)}?v=${cacheBuster}`;
            }
        }
    }, [logoAvailability, backendUrl, cacheBuster]);
}

export function useLogoManagement(
    mainLogoId: LogoID,
    secondaryLogoId: LogoID,
): { mainLogoUrl: string | null; secondaryLogoUrl: string | null; isLoading: boolean } {
    const { i18n } = useTranslation();
    const { data: appConfig } = useAppConfig();
    const { data: logoAvailability, isLoading } = useLogoAvailabilities(axiosPureInstance);
    const { addEventListener, removeEventListener } = useSse();
    const [cacheBuster, setCacheBuster] = useState(() => Date.now());

    useEffect(() => {
        function onLogoAvailabilityChanged() {
            setCacheBuster(Date.now());
        }

        addEventListener(sseEvents.LogoAvailabilityChanged, onLogoAvailabilityChanged);
        return () => {
            removeEventListener(sseEvents.LogoAvailabilityChanged, onLogoAvailabilityChanged);
        };
    }, [addEventListener, removeEventListener]);

    usePreloadLogos(logoAvailability, appConfig?.backendUrl, cacheBuster);

    const currentLang = i18n.language as LangCode;

    const mainLogoUrl = getLangLogoUrl(
        logoAvailability,
        mainLogoId,
        currentLang,
        appConfig?.backendUrl,
        cacheBuster,
    );
    const secondaryLogoUrl = getLangLogoUrl(
        logoAvailability,
        secondaryLogoId,
        currentLang,
        appConfig?.backendUrl,
        cacheBuster,
    );

    return { mainLogoUrl, secondaryLogoUrl, isLoading };
}
