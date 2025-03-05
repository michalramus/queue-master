import { AxiosInstance } from "axios";

/**
 * Instance of Axios for accessing endpoints that do not require authentication.
 * Configure base URL and other settings here.
 */
export interface AxiosPureInstance {
    pure: AxiosInstance;
}

/**
 * Instance of Axios for accessing endpoints that require authentication.
 * Use interceptors to refresh the token if it is expired.
 * Configure:
 * 1. base URL
 * 2. withCredentials: true
 * 3. other settings you with
 */
export interface AxiosAuthInstance {
    auth: AxiosInstance;
}
