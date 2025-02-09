import axios from "axios";
import { AxiosPureInstance } from "shared-utils";

export const axiosPureInstance: AxiosPureInstance = {
    pure: axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
        withCredentials: true,
    }),
};

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
