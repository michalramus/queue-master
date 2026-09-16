import axios from "axios";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { getCookie } from "cookies-next";
import { AxiosAuthInstance, logout, refreshJWTToken } from "shared-utils";
import { axiosPureInstance } from "./axiosPureInstance";

export const axiosAuthInstance: AxiosAuthInstance = {
    auth: axios.create({
        baseURL: typeof window === "undefined" ? `${getBackendUrl()}/api` : "/api",
        withCredentials: true,
    }),
};

/**
 * In-flight refresh deduplication.
 *
 * WARNING: this is module scope, which on the Next.js server is shared by EVERY request handled by
 * the process — i.e. by every user. Reusing a cached promise there would make one user await
 * another user's refresh and then copy that user's `Set-Cookie` into their own request headers,
 * authenticating them as the wrong person. It is therefore only ever read/written on the client,
 * where the process belongs to a single user. Server-side refreshes always issue a fresh call with
 * that request's own cookies. Do not lift this back into the shared path.
 */
let clientJWTRefreshTokenPromise: Promise<Response> | null = null;

//Request part
axiosAuthInstance.auth.interceptors.request.use(
    async function (config) {
        //before request is sent
        const tokenInvalidationTimeOffset = 5 * 60 * 1000; //5 minutes | when token has less than X minutes left, it will be considered invalid

        let accessTokenExpirationDate: null | Date = null;
        let refreshTokenExpirationDate: null | Date = null;
        let serverSideCookies: string | null = null;

        //fetch cookies
        if (typeof window !== "undefined") {
            // client side
            const jwt_expiration_date_cookie = await getCookie("jwt_expiration_date");
            if (jwt_expiration_date_cookie) {
                accessTokenExpirationDate = new Date(jwt_expiration_date_cookie);
            }

            const refresh_token_expiration_date_cookie = await getCookie(
                "jwt_refresh_expiration_date",
            );
            if (refresh_token_expiration_date_cookie) {
                refreshTokenExpirationDate = new Date(refresh_token_expiration_date_cookie);
            }
        } else {
            // server side
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            serverSideCookies = cookieStore.toString();

            const jwt_expiration_date_cookie = await getCookie("jwt_expiration_date", {
                cookies: () => Promise.resolve(cookieStore),
            });
            if (jwt_expiration_date_cookie) {
                accessTokenExpirationDate = new Date(jwt_expiration_date_cookie);
            }

            const refresh_token_expiration_date_cookie = await getCookie(
                "jwt_refresh_expiration_date",
                { cookies: () => Promise.resolve(cookieStore) },
            );
            if (refresh_token_expiration_date_cookie) {
                refreshTokenExpirationDate = new Date(refresh_token_expiration_date_cookie);
            }
        }

        //validate JWT token
        if (
            accessTokenExpirationDate &&
            accessTokenExpirationDate.getTime() - new Date().getTime() > tokenInvalidationTimeOffset
        ) {
            if (serverSideCookies) {
                config.headers["Cookie"] = serverSideCookies;
            }

            return config;
        }

        //validate JWT refresh token
        if (
            refreshTokenExpirationDate &&
            refreshTokenExpirationDate.getTime() - new Date().getTime() >
                tokenInvalidationTimeOffset
        ) {
            if (serverSideCookies) {
                // Server side: never share the promise across requests (see warning above).
                const refreshJWTTokenResponse: Response = await refreshJWTToken(
                    axiosPureInstance,
                    serverSideCookies,
                );

                config.headers["Cookie"] = refreshJWTTokenResponse.headers
                    .getSetCookie()
                    .toString();

                return config;
            }

            // Client side: one browser process = one user, so deduplicating concurrent refreshes
            // is safe here.
            if (!clientJWTRefreshTokenPromise) {
                clientJWTRefreshTokenPromise = refreshJWTToken(axiosPureInstance);
            }

            try {
                await clientJWTRefreshTokenPromise;
            } finally {
                // Reset on failure too, otherwise a rejected promise stays cached and poisons
                // every subsequent request.
                clientJWTRefreshTokenPromise = null;
            }

            return config;
        }

        await logout(axiosPureInstance);
        // token expired
        return Promise.reject({
            response: {
                status: 401,
                data: {
                    message: "Token expired",
                },
            },
        });
    },
    function (error) {
        //request error
        console.log(error.toJSON());
        return Promise.reject(error);
    },
);

//Response part
axiosAuthInstance.auth.interceptors.response.use(
    function (response) {
        // Do something with response data
        return response;
    },
    function (error) {
        // Do something with response error
        return Promise.reject(error);
    },
);
