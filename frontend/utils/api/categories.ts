export interface Category {
    id: string;
    name: string;
}

const apiPath = "/categories";

export async function getCategories(): Promise<Category[]> {
    const response = await fetch(process.env.NEXT_PUBLIC_API + apiPath, {
        method: "GET",
    });

    const res = await response.json();
    return res;
}
