import { fetchSSRMiddleware } from "./fetchSSRMiddleware";
import { ClientInterface } from "@/utils/api/CSR/clients";

const apiPath = "/clients";

export async function addClientSSR(categoryId: number): Promise<ClientInterface | null> {
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
    clientNumber: ClientInterface,
    seat: number,
): Promise<ClientInterface | null> {
    clientNumber.seat = seat;
    clientNumber.status = "InService";

    const response = await fetchSSRMiddleware((cookie) =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPath + "/" + clientNumber.id, {
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
    clientNumber: ClientInterface,
): Promise<ClientInterface | null> {
    const response = await fetchSSRMiddleware((cookie) =>
        fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL + apiPath + "/" + clientNumber.id + "/call-again",
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

export async function removeClientSSR(
    clientNumber: ClientInterface,
): Promise<ClientInterface | null> {
    const response = await fetchSSRMiddleware((cookie) =>
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + apiPath + "/" + clientNumber.id, {
            method: "DELETE",
            credentials: "include",
            headers: { Cookie: cookie },
        }),
    );

    const res = await response.json();

    return res;
}

export async function getClientsSSR(): Promise<ClientInterface[]> {
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
