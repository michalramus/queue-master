import { cookies } from "next/headers";
import { refreshJWTTokenSSR } from "../SSR/auth";

/**
 * Function fetches http cookies from browser and passes it to request
 * If error 401 received, function tries to refresh access token
 * @param fetch pointer to fetch function
 * @returns response
 */
export async function fetchSSRMiddleware(
    fetch: (cookie: string) => Promise<Response>,
): Promise<Response> {
    const cookie = (await cookies()).toString();
    const res = await fetch(cookie);

    if (res.status == 401) {
        return await fetch((await refreshJWTTokenSSR(cookie)).headers.getSetCookie().toString());
    }
    return res;
}
