"use client";
import { fetchMiddleware } from "./fetchMiddleware";
import { AxiosPureInstance } from "shared-utils";

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

export async function refreshJWTToken(axiosInstance: AxiosPureInstance) {
    const response = await axiosInstance.inst.post(apiPath + "/refresh", {}).catch((error) => {
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
export async function getInfo() {
    //TODO
    const response = await fetchMiddleware(() =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPath + "/get-info", {
            method: "GET",
            credentials: "include",
        }),
    );

    return response;
}
