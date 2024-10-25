"use client";
import { fetchMiddleware } from "./fetchMiddleware";

export interface Category {
    id: string;
    name: string;
}

const apiPath = "/categories";

export async function getCategories(): Promise<Category[]> {
    const response = await fetchMiddleware(() =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPath, {
            method: "GET",
            credentials: "include",
        }),
    );

    const res = await response.json();
    return res;
}
