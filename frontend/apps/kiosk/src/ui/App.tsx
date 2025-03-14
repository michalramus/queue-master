import RefreshOnGlobalSettingsChanged from "./components/RefreshOnGlobalSettingsChanged";
import KioskPage from "./pages/kiosk/page";
import { AppConfigProvider } from "./utils/providers/AppConfigProvider";
import { GlobalSettingsProvider } from "./utils/providers/GlobalSettingsProvider";

import TVPage from "@/pages/tv/page";

import { getGlobalSettings } from "shared-utils";
import { useQuery } from "@tanstack/react-query";
import { axiosPureInstance } from "./utils/axiosInstances/axiosPureInstance";

export default function App() {
    const {
        data: globalSettings,
        isLoading: globalSettingsLoading,
        isError: globalSettingsError,
    } = useQuery({
        queryKey: ["App_globalSettings"],
        queryFn: () => getGlobalSettings(axiosPureInstance),
    });

    const {
        data: appConfig,
        isLoading: appConfigLoading,
        isError: appConfigError,
    } = useQuery({
        queryKey: ["App_appConfig"],
        queryFn: () => window.electronAPI.getAppConfig(),
    });

    //TODO move errors rendering to a separate component

    if (globalSettingsLoading || appConfigLoading) {
        return <div>Loading...</div>;
    }

    if (appConfig?.configError) {
        return <div>Invalid config or config path</div>;
    }

    if (globalSettingsError || appConfigError || !globalSettings || !appConfig) {
        return <div>Error when connecting to the server</div>;
    }

    if (appConfig.mode !== "tv" && appConfig.mode !== "kiosk") {
        return <div>Invalid mode</div>;
    }

    //TODO config and auth and default language

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

            <AppConfigProvider appConfig={appConfig}>
                <RefreshOnGlobalSettingsChanged />
                <GlobalSettingsProvider globalSettings={globalSettings}>
                    {appConfig.mode === "tv" && <TVPage />}
                    {appConfig.mode === "kiosk" && <KioskPage />}
                </GlobalSettingsProvider>
            </AppConfigProvider>
        </>
    );
}
