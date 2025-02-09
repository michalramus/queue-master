import { AxiosAuthInstance, AxiosPureInstance } from "../axiosInstances.interface";

export interface UserSettingsInterface {
    seat?: number;
}
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
    color_text_1: string;
    color_text_2: string;

    locale: string;
    kiosk_markdown: string;
}

const apiPathGlobalSettings = "/settings/global";
const apiPathUserSettings = "/settings/user";

/**
 *
 * @param userId Use this parameter only from Admin account
 * @returns
 */
export async function getUserSettings(
    axiosAuthInstance: AxiosAuthInstance,
    userId?: number,
): Promise<UserSettingsInterface> {
    const response = await axiosAuthInstance.auth
        .get(apiPathUserSettings + (userId ? `/${userId}` : ""))
        .catch((error) => {
            return error.response;
        });

    return response.data;
}

/**
 *
 * @param userSettings
 * @param userId  Use this parameter only from Admin account
 * @returns
 */
export async function setUserSettings(
    userSettings: UserSettingsInterface,
    axiosAuthInstance: AxiosAuthInstance,
    userId?: number,
): Promise<UserSettingsInterface> {
    const response = await axiosAuthInstance.auth
        .patch(apiPathUserSettings + (userId ? `/${userId}` : ""), userSettings)
        .catch((error) => {
            return error.response;
        });

    return response.data;
}

export async function getGlobalSettings(
    axiosPureInstance: AxiosPureInstance,
): Promise<GlobalSettingsInterface> {
    const response = await axiosPureInstance.pure.get(apiPathGlobalSettings).catch((error) => {
        return error.response;
    });

    return response.data;
}

/**
 * Use this endpoint only from Admin account
 * @param globalSettings
 * @returns
 */
export async function setGlobalSettings(
    globalSettings: GlobalSettingsInterface,
    axiosAuthInstance: AxiosAuthInstance,
): Promise<GlobalSettingsInterface> {
    const response = await axiosAuthInstance.auth
        .patch(apiPathGlobalSettings, globalSettings)
        .catch((error) => {
            return error.response;
        });

    return response.data;
}
