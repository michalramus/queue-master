import { AxiosAuthInstance } from "../axiosInstances.interface";

export interface UserSettingsInterface {
    desk?: number;
}

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
    const response = await axiosAuthInstance.auth.get(
        apiPathUserSettings + (userId ? `/${userId}` : ""),
    );

    return response.data;
}

/**
 * Get settings for all users (Admin only)
 * @returns Object mapping user IDs to their settings
 */
export async function getAllUsersSettings(
    axiosAuthInstance: AxiosAuthInstance,
): Promise<{ [userId: number]: UserSettingsInterface }> {
    const response = await axiosAuthInstance.auth.get(apiPathUserSettings + "/all");
    return response.data;
}

/**
 *
 * @param userSettings
 * @param userId  Use this parameter only from Admin account
 * @returns
 */
export async function updateUserSettings(
    userSettings: UserSettingsInterface,
    axiosAuthInstance: AxiosAuthInstance,
    userId?: number,
): Promise<UserSettingsInterface> {
    const response = await axiosAuthInstance.auth.patch(
        apiPathUserSettings + (userId ? `/${userId}` : ""),
        userSettings,
    );

    return response.data;
}

/**
 * Reset user settings to defaults
 * @param axiosAuthInstance
 * @param userId User ID (Admin only). If not provided, resets current user's settings.
 * @param settings Array of setting keys to reset. If empty or not provided, all settings will be reset.
 * @returns User settings after reset
 */
export async function resetUserSettings(
    axiosAuthInstance: AxiosAuthInstance,
    userId?: number,
    settings?: string[],
): Promise<UserSettingsInterface> {
    const path = userId ? `${apiPathUserSettings}/${userId}` : apiPathUserSettings;
    const response = await axiosAuthInstance.auth.delete(path, {
        data: { settings: settings || [] },
    });

    return response.data;
}
