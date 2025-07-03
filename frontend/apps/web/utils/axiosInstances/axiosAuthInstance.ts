import axios from "axios";
import { getCookie } from "cookies-next";
import { AxiosAuthInstance, logout, refreshJWTToken } from "shared-utils";
import { axiosPureInstance } from "./axiosPureInstance";

export const axiosAuthInstance: AxiosAuthInstance = {
    auth: axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
        withCredentials: true,
    }),
};

let JWTRefreshTokenPromise: Promise<Response> | null = null;

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
            if (!JWTRefreshTokenPromise) {
                if (serverSideCookies) {
                    JWTRefreshTokenPromise = refreshJWTToken(axiosPureInstance, serverSideCookies);
                } else {
                    JWTRefreshTokenPromise = refreshJWTToken(axiosPureInstance);
                }
            }

            const refreshJWTTokenResponse = await JWTRefreshTokenPromise;

            if (serverSideCookies) {
                config.headers["Cookie"] = refreshJWTTokenResponse.headers
                    .getSetCookie()
                    .toString();
            }
            JWTRefreshTokenPromise = null;
            return config;
        }

        logout(axiosPureInstance);
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
        if (error.response) {
            // Server responded with a status code outside the 2xx range
            console.error("Error Response:", error.response.data);
        } else if (error.request) {
            // Request was made but no response received
            console.error("No response received:", error.request);
        } else {
            // Something happened in setting up the request
            console.error("Request error:", error.message);
        }
        return Promise.reject(error);
    },
);
