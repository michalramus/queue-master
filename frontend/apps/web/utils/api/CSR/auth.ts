import { AxiosAuthInstance, AxiosPureInstance } from "shared-utils";

const apiPath = "/auth";

export async function login(username: string, password: string, axiosInstance: AxiosPureInstance) {
    const response = await axiosInstance.inst
        .post(
            apiPath + "/login",
            { username, password },
            { headers: { "Content-Type": "application/json" } },
        )
        .catch((error) => {
            return error.response;
        });

    return response;
}

export async function registerDevice(axiosInstance: AxiosPureInstance) {
    const response = await axiosInstance.inst
        .post(apiPath + "/register-device", {})
        .catch((error) => {
            return error.response;
        });

    return response;
}

/**
 *
 * @param axiosInstance
 * @param cookie Cookie string which "Cookie" header will be set to
 * @returns
 */
export async function refreshJWTToken(
    axiosInstance: AxiosPureInstance,
    cookie: null | string = null,
) {
    const headers: { [key: string]: string } = {};
    if (cookie) {
        headers["Cookie"] = cookie;
    }

    const response = await axiosInstance.inst
        .post(apiPath + "/refresh", {}, { headers })
        .catch((error) => {
            return error.response;
        });

    return response;
}

export async function logout(axiosInstance: AxiosPureInstance) {
    const response = await axiosInstance.inst.post(apiPath + "/logout", {}).catch((error) => {
        return error.response;
    });

    return response;
}

/**
 * @returns Info about logged in user or device !!!Convert it to JSON manually!!!
 */
export async function getInfo(axiosAuthInstance: AxiosAuthInstance) {
    const response = await axiosAuthInstance.inst.get(apiPath + "/get-info").catch((error) => {
        return error.response;
    });

    return response;
}
