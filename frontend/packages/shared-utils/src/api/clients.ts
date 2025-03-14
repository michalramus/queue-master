import { CategoryInterface } from "./categories";
import { AxiosAuthInstance } from "../axiosInstances.interface";

export interface ClientInterface {
    id: number;
    number: number;
    category_id: number;
    category: CategoryInterface;
    status: "Waiting" | "InService";
    seat: number | null;
    creation_date: Date;
}

const apiPath = "/clients";

export async function addClient(
    categoryId: number,
    axiosAuthInstance: AxiosAuthInstance,
): Promise<ClientInterface> {
    const response = await axiosAuthInstance.auth.post(apiPath, { categoryId: categoryId });

    return response.data;
}

export async function setClientAsInService(
    clientNumber: ClientInterface,
    seat: number,
    axiosAuthInstance: AxiosAuthInstance,
): Promise<ClientInterface | null> {
    clientNumber.seat = seat;
    clientNumber.status = "InService";

    const response = await axiosAuthInstance.auth.patch(
        apiPath + "/" + clientNumber.id,
        clientNumber,
    );

    return response.data;
}

export async function callAgainForClient(
    clientNumber: ClientInterface,
    axiosAuthInstance: AxiosAuthInstance,
): Promise<ClientInterface | null> {
    const response = await axiosAuthInstance.auth.post(
        apiPath + "/" + clientNumber.id + "/call-again",
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
