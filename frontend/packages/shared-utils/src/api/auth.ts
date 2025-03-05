import { AxiosAuthInstance, AxiosPureInstance } from "shared-utils";

const apiPath = "/auth";

export async function login(username: string, password: string, axiosInstance: AxiosPureInstance) {
    const response = await axiosInstance.pure.post(
        apiPath + "/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } },
    );

    return response;
}

export async function registerDevice(axiosInstance: AxiosPureInstance) {
    const response = await axiosInstance.pure.post(apiPath + "/register-device", {});

    return response;
}

/**
 * Use this function to refresh JWT token
 *
 * Under the hood, function uses fetch instead of axios, because axios can't handle multiple set-cookie headers
 * https://stackoverflow.com/questions/56237815/axios-returns-only-last-set-cookie-if-there-are-multiple
 *
 * @param axiosInstance
 * @param cookie Cookie string which "Cookie" header will be set to
 * @returns
 */
export async function refreshJWTToken(
    axiosInstance: AxiosPureInstance,
    cookie: null | string = null,
    authorization: null | string = null,
) {
    const headers: any = {};
    if (cookie) {
        headers["Cookie"] = cookie;
    }
    if (authorization) {
        headers["Authorization"] = authorization;
    }

    const response = await fetch(axiosInstance.pure.defaults.baseURL + apiPath + "/refresh", {
        method: "POST",
        credentials: "include",
        headers: headers,
    });

    return response;
}

export async function logout(axiosInstance: AxiosPureInstance) {
    const response = await axiosInstance.pure.post(apiPath + "/logout", {});

    return response;
}

/**
 * @returns Info about logged in user or device
 */
export async function getInfo(
    axiosAuthInstance: AxiosAuthInstance,
): Promise<{ data: any; status: number }> {
    const response = await axiosAuthInstance.auth.get(apiPath + "/get-info");

    return response;
}
