import { fetchMiddleware } from "./fetchMiddleware";

export interface ClientNumber {
    number: string;
    category_id: string;
    category: { name: string };
    status: string;
    seat: number | null;
    creation_date: string;
}

const apiPath = "/clients";

//Websocket events names
export enum wsClientEvents {
    ClientWaiting = "ClientWaiting",
    ClientInService = "ClientInService",
    ClientRemoved = "ClientRemoved",
    ClientCallAgain = "ClientCallAgain",
}

export async function addClient(categoryId: string): Promise<ClientNumber | null> {
    const response = await fetchMiddleware(() =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPath, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({ categoryId: categoryId }),
            credentials: "include",
        }),
    );

    const res = await response.json();

    return res;
}

export async function setClientAsInService(
    clientNumber: ClientNumber,
    seat: number,
): Promise<ClientNumber | null> {
    clientNumber.seat = seat;
    clientNumber.status = "InService";

    const response = await fetchMiddleware(() =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPath + "/" + clientNumber.number, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(clientNumber),
            credentials: "include",
        }),
    );

    const res = await response.json();

    return res;
}

export async function callAgainForClient(clientNumber: ClientNumber): Promise<ClientNumber | null> {
    const response = await fetchMiddleware(() =>
        fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL +
                apiPath +
                "/" +
                clientNumber.number +
                "/call-again",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            },
        ),
    );

    const res = await response.json();

    return res;
}

export async function removeClient(clientNumber: ClientNumber): Promise<ClientNumber | null> {
    const response = await fetchMiddleware(() =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPath + "/" + clientNumber.number, {
            method: "DELETE",
            credentials: "include",
        }),
    );

    const res = await response.json();

    return res;
}

export async function getClients(): Promise<ClientNumber[]> {
    const response = await fetchMiddleware(() =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPath, {
            method: "GET",
            credentials: "include",
        }),
    );

    const res = await response.json();
    return res;
}
