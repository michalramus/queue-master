import { AxiosInstance } from "axios";

/**
 * Instance of Axios for accessing endpoints that do not require authentication.
 * Configure base URL and other settings here.
 */
export interface AxiosPureInstance {
    inst: AxiosInstance;
}

/**
 * Instance of Axios for accessing endpoints that require authentication.
 * Use interceptors to refresh the token if it is expired.
 * Configure base URL and other settings here.
 */
export interface AxiosAuthInstance {
    inst: AxiosInstance;
}
