import RefreshOnSseEvents from "./components/RefreshOnSseEvents";
import KioskPage from "./pages/kiosk/page";
import { StartupScreen } from "shared-components";

import TVPage from "@/pages/tv/page";

import { useGlobalSettings, useMultilingualSettings, useOpeningHours } from "shared-utils";
import { axiosPureInstance } from "./utils/axiosInstances/axiosPureInstance";
import { useCallback, useEffect, useMemo, useState } from "react";
import i18n from "./i18n";
import { isKioskOpen } from "./utils/isKioskOpen";
import { axiosAuthInstance } from "./utils/axiosInstances/axiosAuthInstance";
import { useAppConfig } from "./utils/hooks/useAppConfig";
import { useSse } from "./utils/hooks/useSse";

export default function App() {
    const { data: globalSettings, isError: globalSettingsError } =
        useGlobalSettings(axiosPureInstance);

    const {
        data: appConfig,
        isError: appConfigError,
        isLoading: appConfigLoading,
    } = useAppConfig();

    const [localIpAddress, setLocalIpAddress] = useState<string>("");
    useEffect(() => {
        window.electronAPI.getLocalIpAddress().then(setLocalIpAddress);
    }, []);

    //TODO add error handling for opening hours
    const {
        data: openingHours,
        // isLoading: openingHoursLoading,
        // isError: openingHoursError,
    } = useOpeningHours(axiosAuthInstance, { retry: true });

    const { data: multilingualSettings } = useMultilingualSettings(axiosPureInstance);

    //TODO: Fix multi calls to scripts when app starts
    const [tick, setTick] = useState(false); //Used to trigger recomputation of kioskOpen/tvOpen every minute

    // Toggle tick aligned to minute boundaries to trigger kioskOpen/tvOpen recomputation
    useEffect(() => {
        const now = new Date();
        const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        let interval: ReturnType<typeof setInterval>;

        const timeout = setTimeout(() => {
            setTick((t) => !t);
            interval = setInterval(() => setTick((t) => !t), 60000);
        }, msToNextMinute);

        return () => {
            clearTimeout(timeout);
            if (interval) clearInterval(interval);
        };
    }, []);

    //TODO: use openingHoursLoading instead of "notSet"
    const kioskOpen = useMemo((): boolean | "notSet" => {
        if (!openingHours || !globalSettings) return "notSet";
        return isKioskOpen(openingHours, globalSettings, globalSettings.kiosk_open_offset);
        // tick is intentionally included to recompute every minute
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openingHours, globalSettings, tick]);

    const tvOpen = useMemo((): boolean | "notSet" => {
        if (!openingHours || !globalSettings) return "notSet";
        return isKioskOpen(openingHours, globalSettings, 0, globalSettings.tv_close_offset);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openingHours, globalSettings, tick]);

    const executeOpeningHoursScripts = useCallback(
        (isOpen: boolean) => {
            if (!appConfig?.openingHoursEnableScripts) return;

            if (isOpen) {
                window.electronAPI.executeOpenKioskScript();
            } else {
                window.electronAPI.executeCloseKioskScript();
            }
        },
        [appConfig?.openingHoursEnableScripts],
    );

    // Execute scripts on kioskOpen change
    useEffect(() => {
        if (kioskOpen === "notSet") return;
        executeOpeningHoursScripts(kioskOpen);
    }, [kioskOpen, executeOpeningHoursScripts]);

    useEffect(() => {
        if (globalSettings?.locale) {
            i18n.changeLanguage(globalSettings.locale);
        }
    }, [globalSettings?.locale]);

    const { isConnected, backoffMs } = useSse();

    if (appConfigLoading) {
        return <StartupScreen status="loading" title="Starting up…" />;
    }

    if (appConfig?.configError) {
        return (
            <StartupScreen
                status="info"
                title="Invalid configuration"
                details="Config file is invalid or the path is incorrect."
            />
        );
    }

    if (appConfig && !appConfig.backendUrl) {
        return (
            <StartupScreen
                status="info"
                title="Backend URL not provided"
                details="Backend URL is required. Please provide it in the config file."
            />
        );
    }

    if (globalSettingsError || appConfigError || !globalSettings || !appConfig) {
        return (
            <StartupScreen
                status="connecting"
                title="Connecting to the server..."
                details={`Backend: ${appConfig?.backendUrl ?? "unknown"}\nKiosk IP: ${localIpAddress || "unknown"}`}
            />
        );
    }

    if (appConfig.mode !== "tv" && appConfig.mode !== "kiosk") {
        return (
            <StartupScreen
                status="error"
                title="Invalid mode"
                details={`Current: "${appConfig.mode}". Valid values: "kiosk", "tv". Check config file.`}
            />
        );
    }

    if (!isConnected && backoffMs >= 2000) {
        return (
            <StartupScreen status="connecting" title="SSE not connected. Connecting to server..." />
        );
    }

    //TODO config and auth

    return (
        <>
            {/* Setup global colors */}
            <style>{`:root {
            
                                ${globalSettings.color_background ? `--color-background: ${globalSettings.color_background} !important;` : ""}
                                ${globalSettings.color_primary_1 ? `--color-primary-1: ${globalSettings.color_primary_1} !important;` : ""}
                                ${globalSettings.color_primary_2 ? `--color-primary-2: ${globalSettings.color_primary_2} !important;` : ""}
                                ${globalSettings.color_secondary_1 ? `--color-secondary-1: ${globalSettings.color_secondary_1} !important;` : ""}
                                ${globalSettings.color_secondary_2 ? `--color-secondary-2: ${globalSettings.color_secondary_2} !important;` : ""}
                                ${globalSettings.color_accent_1 ? `--color-accent-1: ${globalSettings.color_accent_1} !important;` : ""}
                                ${globalSettings.color_green_1 ? `--color-green-1: ${globalSettings.color_green_1} !important;` : ""}
                                ${globalSettings.color_green_2 ? `--color-green-2: ${globalSettings.color_green_2} !important;` : ""}
                                ${globalSettings.color_blue_1 ? `--color-blue-1: ${globalSettings.color_blue_1} !important;` : ""}
                                ${globalSettings.color_blue_2 ? `--color-blue-2: ${globalSettings.color_blue_2} !important;` : ""}
                                ${globalSettings.color_red_1 ? `--color-red-1: ${globalSettings.color_red_1} !important;` : ""}
                                ${globalSettings.color_red_2 ? `--color-red-2: ${globalSettings.color_red_2} !important;` : ""}
                                ${globalSettings.color_gray_1 ? `--color-gray-1: ${globalSettings.color_gray_1} !important;` : ""}
                                ${globalSettings.color_gray_2 ? `--color-gray-2: ${globalSettings.color_gray_2} !important;` : ""}
                                ${globalSettings.color_text_1 ? `--color-text-1: ${globalSettings.color_text_1} !important;` : ""}
                                ${globalSettings.color_text_2 ? `--color-text-2: ${globalSettings.color_text_2} !important;` : ""}
                                }`}</style>

            <RefreshOnSseEvents />
            {appConfig.mode === "tv" && (
                <TVPage
                    tvOpen={tvOpen === "notSet" ? true : tvOpen}
                    openingHours={openingHours || []}
                    multilingualSettings={multilingualSettings}
                />
            )}
            {appConfig.mode === "kiosk" && (
                <KioskPage
                    kioskOpen={kioskOpen === "notSet" ? true : kioskOpen}
                    openingHours={openingHours || []}
                    multilingualSettings={multilingualSettings}
                />
            )}
        </>
    );
}
//TODO: Move kioskOpen and openingHours to (use...) instead of providing by props to pages
