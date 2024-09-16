import { fetchSSRMiddleware } from "./fetchSSRMiddleware";

const apiPath = "/auth";

export async function refreshJWTTokenSSR(cookie: string) {
    const response = await fetch(process.env.NEXT_PUBLIC_API + apiPath + "/refresh", {
        method: "POST",
        credentials: "include",
        headers: {Cookie: cookie}
    });

    return response;
}

/**
 * @returns Info about logged in user or device !!!Convert it to JSON manually!!!
 */
export async function getInfoSSR() {
    const response = await fetchSSRMiddleware((cookie) =>
        fetch(process.env.NEXT_PUBLIC_API + apiPath + "/get-info", {
            method: "GET",
            credentials: "include",
            headers: { Cookie: cookie },
        }),
    );

    return response;
}
