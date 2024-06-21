export interface ClientNumber {
    number: string;
    categoryId: string;
    category: { name: string };
    status: string;
    seat: number | null;
    creationDate: string;
}

const apiPath = "/clients";

//Websocket events names
export enum wsClientEvents {
    ClientWaiting = "ClientWaiting",
    ClientInService = "ClientInService",
    ClientRemoved = "ClientRemoved",
}

export async function addClient(categoryId: string): Promise<ClientNumber | null> {
    const response = await fetch(process.env.NEXT_PUBLIC_API + apiPath, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({ categoryId: categoryId }),
    });

    const res = await response.json();

    return res;
}

export async function setClientAsInService(clientNumber: ClientNumber, seat: number): Promise<ClientNumber | null> {
    clientNumber.seat = seat;
    clientNumber.status = "InService";

    const response = await fetch(process.env.NEXT_PUBLIC_API + apiPath + "/" + clientNumber.number, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(clientNumber),
    });

    const res = await response.json();

    return res;
}

export async function removeClient(clientNumber: ClientNumber): Promise<ClientNumber | null> {
    const response = await fetch(process.env.NEXT_PUBLIC_API + apiPath + "/" + clientNumber.number, {
        method: "DELETE",
    });

    const res = await response.json();

    return res;
}

export async function getClients(): Promise<ClientNumber[]> {
    const response = await fetch(process.env.NEXT_PUBLIC_API + apiPath, {
        method: "GET",
    });

    const res = await response.json();
    return res;
}
