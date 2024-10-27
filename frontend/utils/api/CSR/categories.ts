"use client";
import { fetchMiddleware } from "./fetchMiddleware";

export interface CategoryInterface {
    id: number;
    short_name: string;
    name: string;
}

const apiPath = "/categories";

export async function getCategories(): Promise<CategoryInterface[]> {
    const response = await fetchMiddleware(() =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPath, {
            method: "GET",
            credentials: "include",
        }),
    );

    const res = await response.json();
    return res;
}
