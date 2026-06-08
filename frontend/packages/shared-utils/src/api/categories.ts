import { AxiosAuthInstance } from "shared-utils";
import { LangCode } from "../types/LangCode";

export interface CategoryInterface {
    id: number;
    short_name: string;
    name: { [lang in LangCode]: string };
}

export interface CategoryCreateDto {
    short_name: string;
    name: { [lang in LangCode]?: string };
}

export interface CategoryUpdateDto {
    short_name?: string;
    name?: { [lang in LangCode]?: string };
}

const apiPath = "/categories";

export async function getCategories(
    axiosAuthInstance: AxiosAuthInstance,
): Promise<CategoryInterface[]> {
    const response = await axiosAuthInstance.auth.get(apiPath);
    return response.data;
}

export async function createCategory(
    axiosAuthInstance: AxiosAuthInstance,
    categoryDto: CategoryCreateDto,
): Promise<CategoryInterface> {
    const response = await axiosAuthInstance.auth.post(apiPath, categoryDto);
    return response.data;
}

export async function updateCategory(
    axiosAuthInstance: AxiosAuthInstance,
    categoryId: number,
    categoryDto: CategoryUpdateDto,
): Promise<CategoryInterface> {
    const response = await axiosAuthInstance.auth.patch(`${apiPath}/${categoryId}`, categoryDto);
    return response.data;
}

export async function deleteCategory(
    axiosAuthInstance: AxiosAuthInstance,
    categoryId: number,
): Promise<void> {
    await axiosAuthInstance.auth.delete(`${apiPath}/${categoryId}`);
}
