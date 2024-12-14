import { fetchSSRMiddleware } from "./fetchSSRMiddleware";

const apiPath = "/file";
const logoApiPath = "/logo";

export async function getLogoAvailabilitySSR(): Promise<number[]> {
    const response = await fetchSSRMiddleware((cookie) =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPath + logoApiPath, {
            method: "GET",
            credentials: "include",
            headers: { Cookie: cookie },
        }),
    );

    const res = await response.json();

    return res.availableLogos;
}
