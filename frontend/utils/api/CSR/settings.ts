"use client";
import { fetchMiddleware } from "./fetchMiddleware";

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

    kiosk_markdown: string;
}

const apiPathGlobalSettings = "/settings/global";
const apiPathUserSettings = "/settings/user";

/**
 *
 * @param userId Use this parameter only from Admin account
 * @returns
 */
export async function getUserSettings(userId?: number): Promise<UserSettingsInterface> {
    const response = await fetchMiddleware(() =>
        fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL +
                apiPathUserSettings +
                (userId ? `/${userId}` : ""),
            {
                method: "GET",
                credentials: "include",
            },
        ),
    );

    const res = await response.json();
    return res;
}

/**
 *
 * @param userSettings
 * @param userId  Use this parameter only from Admin account
 * @returns
 */
export async function setUserSettings(
    userSettings: UserSettingsInterface,
    userId?: number,
): Promise<UserSettingsInterface> {
    const response = await fetchMiddleware(() =>
        fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL +
                apiPathUserSettings +
                (userId ? `/${userId}` : ""),
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(userSettings),
                credentials: "include",
            },
        ),
    );

    const res = await response.json();

    return res;
}

export async function getGlobalSettings(): Promise<GlobalSettingsInterface> {
    const response = await fetchMiddleware(() =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPathGlobalSettings, {
            method: "GET",
            credentials: "include",
        }),
    );

    const res = await response.json();
    return res;
}

/**
 * Use this endpoint only from Admin account
 * @param globalSettings
 * @returns
 */
export async function setGlobalSettings(
    globalSettings: GlobalSettingsInterface,
): Promise<GlobalSettingsInterface> {
    const response = await fetchMiddleware(() =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPathGlobalSettings, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(globalSettings),
            credentials: "include",
        }),
    );

    const res = await response.json();

    return res;
}
