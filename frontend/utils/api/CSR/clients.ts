"use client";
import { fetchMiddleware } from "./fetchMiddleware";

export interface ClientInterface {
    id: number;
    number: number;
    category_id: number;
    category: { id: number; short_name: string; name: string; counter?: number };
    status: "Waiting" | "InService";
    seat: number | null;
    creation_date: Date;
}

const apiPath = "/clients";

//Websocket events names
export enum wsClientEvents {
    ClientWaiting = "ClientWaiting",
    ClientInService = "ClientInService",
    ClientRemoved = "ClientRemoved",
    ClientCallAgain = "ClientCallAgain",
}

export async function addClient(categoryId: number): Promise<ClientInterface | null> {
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
    clientNumber: ClientInterface,
    seat: number,
): Promise<ClientInterface | null> {
    clientNumber.seat = seat;
    clientNumber.status = "InService";

    const response = await fetchMiddleware(() =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPath + "/" + clientNumber.id, {
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

export async function callAgainForClient(
    clientNumber: ClientInterface,
): Promise<ClientInterface | null> {
    const response = await fetchMiddleware(() =>
        fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL + apiPath + "/" + clientNumber.id + "/call-again",
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

export async function removeClient(clientNumber: ClientInterface): Promise<ClientInterface | null> {
    const response = await fetchMiddleware(() =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPath + "/" + clientNumber.id, {
            method: "DELETE",
            credentials: "include",
        }),
    );

    const res = await response.json();

    return res;
}

export async function getClients(): Promise<ClientInterface[]> {
    const response = await fetchMiddleware(() =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPath, {
            method: "GET",
            credentials: "include",
        }),
    );

    const res = await response.json();
    return res;
}
