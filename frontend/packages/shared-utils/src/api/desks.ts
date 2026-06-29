import { AxiosAuthInstance } from "../axiosInstances.interface";

export interface DeskInterface {
    id: number;
    desk_number: number;
    desk_name: string;
    categories?: { id: number; short_name: string }[];
}

export interface DeskCreateDto {
    desk_number: number;
    desk_name: string;
}

export interface DeskUpdateDto {
    desk_number?: number;
    desk_name?: string;
}

const apiPath = "/desks";

export async function getDesks(axiosAuthInstance: AxiosAuthInstance): Promise<DeskInterface[]> {
    const response = await axiosAuthInstance.auth.get(apiPath);
    return response.data;
}

export async function getDesk(
    axiosAuthInstance: AxiosAuthInstance,
    id: number,
): Promise<DeskInterface> {
    const response = await axiosAuthInstance.auth.get(`${apiPath}/${id}`);
    return response.data;
}

export async function createDesk(
    axiosAuthInstance: AxiosAuthInstance,
    dto: DeskCreateDto,
): Promise<DeskInterface> {
    const response = await axiosAuthInstance.auth.post(apiPath, dto);
    return response.data;
}

export async function updateDesk(
    axiosAuthInstance: AxiosAuthInstance,
    id: number,
    dto: DeskUpdateDto,
): Promise<DeskInterface> {
    const response = await axiosAuthInstance.auth.patch(`${apiPath}/${id}`, dto);
    return response.data;
}

export async function deleteDesk(
    axiosAuthInstance: AxiosAuthInstance,
    id: number,
): Promise<DeskInterface> {
    const response = await axiosAuthInstance.auth.delete(`${apiPath}/${id}`);
    return response.data;
}

export async function assignCategoryToDesk(
    axiosAuthInstance: AxiosAuthInstance,
    deskId: number,
    categoryId: number,
): Promise<DeskInterface> {
    const response = await axiosAuthInstance.auth.post(`${apiPath}/${deskId}/categories`, {
        category_id: categoryId,
    });
    return response.data;
}

export async function removeCategoryFromDesk(
    axiosAuthInstance: AxiosAuthInstance,
    deskId: number,
    categoryId: number,
): Promise<DeskInterface> {
    const response = await axiosAuthInstance.auth.delete(
        `${apiPath}/${deskId}/categories/${categoryId}`,
    );
    return response.data;
}
