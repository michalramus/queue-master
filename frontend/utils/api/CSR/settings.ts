"use client";
import { fetchMiddleware } from "./fetchMiddleware";

export interface UserSettingsInterface {
    seat?: number;
}
export interface GlobalSettingsInterface {}

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
