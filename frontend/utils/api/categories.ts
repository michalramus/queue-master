import { fetchMiddleware } from "./fetchMiddleware";

export interface Category {
    id: string;
    name: string;
}

const apiPath = "/categories";

export async function getCategories(): Promise<Category[]> {
    const response = await fetchMiddleware(() =>
        fetch(process.env.NEXT_PUBLIC_API + apiPath, {
            method: "GET",
            credentials: "include",
        }),
    );

    const res = await response.json();
    return res;
}
