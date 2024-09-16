import { fetchSSRMiddleware } from "./fetchSSRMiddleware";
import { Category } from "../CSR/categories";
import { cookies } from "next/headers";

const apiPath = "/categories";

export async function getCategoriesSSR(): Promise<Category[]> {
    const response = await fetchSSRMiddleware((cookie) =>
        fetch(process.env.NEXT_PUBLIC_API + apiPath, {
            method: "GET",
            credentials: "include",
            headers: { Cookie: cookie },
        }),
    );

    const res = await response.json();
    return res;
}
