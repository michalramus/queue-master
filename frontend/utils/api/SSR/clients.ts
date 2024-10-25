import { fetchSSRMiddleware } from "./fetchSSRMiddleware";
import { ClientNumber } from "@/utils/api/CSR/clients";

const apiPath = "/clients";

//Websocket events names
export enum wsClientEvents {
    ClientWaiting = "ClientWaiting",
    ClientInService = "ClientInService",
    ClientRemoved = "ClientRemoved",
    ClientCallAgain = "ClientCallAgain",
}

export async function addClientSSR(categoryId: string): Promise<ClientNumber | null> {
    const response = await fetchSSRMiddleware((cookie) =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPath, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookie,
            },

            body: JSON.stringify({ categoryId: categoryId }),
            credentials: "include",
        }),
    );

    const res = await response.json();

    return res;
}

export async function setClientAsInServiceSSR(
    clientNumber: ClientNumber,
    seat: number,
): Promise<ClientNumber | null> {
    clientNumber.seat = seat;
    clientNumber.status = "InService";

    const response = await fetchSSRMiddleware((cookie) =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPath + "/" + clientNumber.number, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookie,
            },

            body: JSON.stringify(clientNumber),
            credentials: "include",
        }),
    );

    const res = await response.json();

    return res;
}

export async function callAgainForClientSSR(
    clientNumber: ClientNumber,
): Promise<ClientNumber | null> {
    const response = await fetchSSRMiddleware((cookie) =>
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
                    Cookie: cookie,
                },
                credentials: "include",
            },
        ),
    );

    const res = await response.json();

    return res;
}

export async function removeClientSSR(clientNumber: ClientNumber): Promise<ClientNumber | null> {
    const response = await fetchSSRMiddleware((cookie) =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPath + "/" + clientNumber.number, {
            method: "DELETE",
            credentials: "include",
            headers: { Cookie: cookie },
        }),
    );

    const res = await response.json();

    return res;
}

export async function getClientsSSR(): Promise<ClientNumber[]> {
    const response = await fetchSSRMiddleware((cookie) =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPath, {
            method: "GET",
            credentials: "include",
            headers: {
                Cookie: cookie,
            },
        }),
    );

    const res = await response.json();
    return res;
}
