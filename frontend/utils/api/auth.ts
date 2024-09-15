import { fetchMiddleware } from "./fetchMiddleware";

const apiPath = "/auth";

export async function login(username: string, password: string) {
    const response = await fetch(process.env.NEXT_PUBLIC_API + apiPath + "/login", {
        method: "POST",
        body: JSON.stringify({
            username,
            password,
        }),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    return response;
}

export async function registerDevice() {
    const response = await fetch(process.env.NEXT_PUBLIC_API + apiPath + "/register-device", {
        method: "POST",
        credentials: "include",
    });

    return response;
}

export async function refreshJWTToken() {
    const response = await fetch(process.env.NEXT_PUBLIC_API + apiPath + "/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    return response;
}

/**
 * @returns Info about logged in user or device !!!Convert it to JSON manually!!!
 */
export async function getInfo() {
    const response = await fetchMiddleware(() =>
        fetch(process.env.NEXT_PUBLIC_API + apiPath + "/get-info", {
            method: "GET",
            credentials: "include",
        }),
    );

    return response;
}
