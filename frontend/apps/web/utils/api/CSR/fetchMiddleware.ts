"use client";
import { refreshJWTToken } from "./auth";
import { axiosInstance } from "./axiosInstances/axiosInstance";

/**
 * If error 401 received, function tries to refresh access token
 * @param fetch pointer to fetch function
 * @returns response
 */
export async function fetchMiddleware(fetch: () => Promise<Response>): Promise<Response> {
    const res = await fetch();

    if (res.status == 401) {
        await refreshJWTToken(axiosInstance);
        return await fetch();
    }
    return res;
}
