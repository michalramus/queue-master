import axios from "axios";
import { AxiosAuthInstance } from "shared-utils";

const appConfig = await window.electronAPI.getAppConfig();

export const axiosAuthInstance: AxiosAuthInstance = {
    auth: axios.create({
        baseURL: appConfig.backendUrl,
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${appConfig.JWTToken}`,
        },
    }),
};

//Request part
axiosAuthInstance.auth.interceptors.request.use(
    async function (config) {
        return config;
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
