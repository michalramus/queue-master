import { AxiosAuthInstance } from "shared-utils";

export interface CategoryInterface {
    id: number;
    short_name: string;
    name: { [lang: string]: string };
}

const apiPath = "/categories";

export async function getCategories(
    axiosAuthInstance: AxiosAuthInstance,
): Promise<CategoryInterface[]> {
    const response = await axiosAuthInstance.auth.get(apiPath).catch((error) => {
        return error.response;
    });

    return response.data;
}
