export interface ClientNumber {
    number: number;
    category: string;
    status: string;
    seat: number | null;
    creationDate: string;
}

const apiPath = "/clients";

export async function addClient(
    category: string,
): Promise<ClientNumber | null> {
    let res: ClientNumber | null = null;

    const response = await fetch(process.env.NEXT_PUBLIC_API + apiPath, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({ category: category }),
    });

    const data = await response.json();
    res = data;

    return res;
}

export async function setClientAsInService(
    client: ClientNumber,
    seat: number,
) {
    client.seat = seat;
    client.status = "In Service";

    const response = await fetch(process.env.NEXT_PUBLIC_API + apiPath, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(client),
    });
}

export async function getClients(): Promise<ClientNumber[]> {
    const response = await fetch(process.env.NEXT_PUBLIC_API + apiPath, {
        method: "GET",
    });

    const data = await response.json();
    let res = data;

    return res;
}
