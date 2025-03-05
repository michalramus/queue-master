import axios from "axios";
import { AxiosPureInstance } from "shared-utils";

export const axiosPureInstance: AxiosPureInstance = {
    pure: axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
        withCredentials: true,
    }),
};

//Request part
axiosPureInstance.pure.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        return config;
    },
    function (error) {
        // Do something with request error
        console.log(error.toJSON());
        return Promise.reject(error);
    },
);

//Response part
axiosPureInstance.pure.interceptors.response.use(
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
