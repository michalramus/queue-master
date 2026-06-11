import { AxiosAuthInstance, AxiosPureInstance } from "../axiosInstances.interface";

export interface GlobalSettingsInterface {
    //colors
    color_background: string;
    color_primary_1: string;
    color_primary_2: string;
    color_secondary_1: string;
    color_secondary_2: string;
    color_accent_1: string;
    color_green_1: string;
    color_green_2: string;
    color_blue_1: string;
    color_blue_2: string;
    color_red_1: string;
    color_red_2: string;
    color_gray_1: string;
    color_gray_2: string;
    color_yellow_1: string;
    color_yellow_2: string;
    color_text_1: string;
    color_text_2: string;

    locale: string;
    kiosk_markdown: string;

    enable_opening_hours: boolean;
    opening_hours_override: "override_to_open" | "override_to_close" | "off";
    tv_auto_switch_language: boolean;

    kiosk_open_offset: number; //How many minutes to open kiosk before opening hour
    tv_close_offset: number; //How many minutes to delay tv close after closing hour
}

export type GlobalSettingsSetDTO = Partial<GlobalSettingsInterface>;
export type ColorKey = Extract<keyof GlobalSettingsInterface, `color_${string}`>;

const apiPathGlobalSettings = "/settings/global";

export async function getGlobalSettings(
    axiosPureInstance: AxiosPureInstance,
): Promise<GlobalSettingsInterface> {
    const response = await axiosPureInstance.pure.get(apiPathGlobalSettings);

    return response.data;
}

/**
 * Use this endpoint only from Admin account
 * @param globalSettings
 * @returns
 */
export async function setGlobalSettings(
    globalSettings: GlobalSettingsSetDTO,
    axiosAuthInstance: AxiosAuthInstance,
): Promise<GlobalSettingsInterface> {
    const response = await axiosAuthInstance.auth.patch(apiPathGlobalSettings, globalSettings);

    return response.data;
}

/**
 * Reset global settings to defaults (Admin only)
 * @param settings Array of setting keys to reset. If empty or not provided, all settings will be reset.
 * @returns Global settings after reset
 */
export async function resetGlobalSettings(
    axiosAuthInstance: AxiosAuthInstance,
    settings?: string[],
): Promise<GlobalSettingsInterface> {
    const response = await axiosAuthInstance.auth.delete(apiPathGlobalSettings, {
        data: { settings: settings || [] },
    });

    return response.data;
}
