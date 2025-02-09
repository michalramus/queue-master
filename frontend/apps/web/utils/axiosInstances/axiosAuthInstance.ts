import axios from "axios";
import { getCookie } from "cookies-next";
import { AxiosAuthInstance, refreshJWTToken } from "shared-utils";
import { axiosPureInstance } from "./axiosPureInstance";

export const axiosAuthInstance: AxiosAuthInstance = {
    auth: axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
        withCredentials: true,
    }),
};

let JWTRefreshTokenPromise: Promise<Response> | null = null;

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
            serverSideCookies = (await cookies()).toString();

            const jwt_expiration_date_cookie = await getCookie("jwt_expiration_date", { cookies });
            if (jwt_expiration_date_cookie) {
                accessTokenExpirationDate = new Date(jwt_expiration_date_cookie);
            }

            const refresh_token_expiration_date_cookie = await getCookie(
                "jwt_refresh_expiration_date",
                { cookies },
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
