import { CategoryInterface } from "./categories";
import { DeskInterface } from "./desks";
import { AxiosAuthInstance } from "../axiosInstances.interface";
import { LangCode } from "../types/LangCode";

export interface ClientInterface {
    id: number;
    number: number;
    category_id: number;
    category: CategoryInterface;
    status: "Waiting" | "InService";
    desk: DeskInterface | null;
    language: LangCode;
    creation_date: Date;
    queue_length?: number;
}

const apiPath = "/clients";

export async function addClient(
    categoryId: number,
    language: LangCode,
    axiosAuthInstance: AxiosAuthInstance,
): Promise<ClientInterface> {
    const response = await axiosAuthInstance.auth.post(apiPath, {
        categoryId: categoryId,
        language: language,
    });

    return response.data;
}

export async function setClientAsInService(
    client: ClientInterface,
    deskId: number,
    axiosAuthInstance: AxiosAuthInstance,
): Promise<ClientInterface | null> {
    const response = await axiosAuthInstance.auth.patch(apiPath + "/" + client.id, {
        status: "InService",
        desk_id: deskId,
    });

    return response.data;
}

export async function callAgainForClient(
    clientNumber: ClientInterface,
    axiosAuthInstance: AxiosAuthInstance,
): Promise<ClientInterface | null> {
    const response = await axiosAuthInstance.auth.post(
        `${apiPath}/${clientNumber.id}/call-again`,
        {},
    );

    return response.data;
}

export async function removeClient(
    clientNumber: ClientInterface,
    axiosAuthInstance: AxiosAuthInstance,
): Promise<ClientInterface | null> {
    const response = await axiosAuthInstance.auth.delete(apiPath + "/" + clientNumber.id);

    return response.data;
}

export async function getClients(axiosAuthInstance: AxiosAuthInstance): Promise<ClientInterface[]> {
    const response = await axiosAuthInstance.auth.get(apiPath).catch((error) => {
        return error.response;
    });

    return response.data;
}
