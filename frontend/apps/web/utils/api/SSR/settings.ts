import { fetchSSRMiddleware } from "./fetchSSRMiddleware";
import { GlobalSettingsInterface, UserSettingsInterface } from "../CSR/settings";

const apiPathGlobalSettings = "/settings/global";
const apiPathUserSettings = "/settings/user";

/**
 *
 * @param userId Use this parameter only from Admin account
 * @returns
 */
export async function getUserSettingsSSR(userId?: number): Promise<UserSettingsInterface> {
    const response = await fetchSSRMiddleware((cookie) =>
        fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL +
                apiPathUserSettings +
                (userId ? `/${userId}` : ""),
            {
                method: "GET",
                headers: {
                    Cookie: cookie,
                },
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
export async function setUserSettingsSSR(
    userSettings: UserSettingsInterface,
    userId?: number,
): Promise<UserSettingsInterface> {
    const response = await fetchSSRMiddleware((cookie) =>
        fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL +
                apiPathUserSettings +
                (userId ? `/${userId}` : ""),
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookie,
                },

                body: JSON.stringify(userSettings),
                credentials: "include",
            },
        ),
    );

    const res = await response.json();

    return res;
}

export async function getGlobalSettingsSSR(): Promise<GlobalSettingsInterface> {
    const response = await fetchSSRMiddleware((cookie) =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPathGlobalSettings, {
            method: "GET",
            headers: {
                Cookie: cookie,
            },
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
export async function setGlobalSettingsSSR(
    globalSettings: GlobalSettingsInterface,
): Promise<GlobalSettingsInterface> {
    const response = await fetchSSRMiddleware((cookie) =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPathGlobalSettings, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookie,
            },

            body: JSON.stringify(globalSettings),
            credentials: "include",
        }),
    );

    const res = await response.json();

    return res;
}
