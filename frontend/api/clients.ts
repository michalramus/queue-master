export interface ClientNumber {
    number: number;
    category: string;
    status: string;
    position: number | undefined;
    creationDate: string;
}

const apiPath = "/clients";

export async function addClient(category: string): Promise<ClientNumber> {
    let res: ClientNumber = {} as ClientNumber;

    const response = await fetch(process.env.NEXT_PUBLIC_API + apiPath, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({ category: category}),
    });

    const data = await response.json();
    res = data;

    return res;
}


export async function setClientAsInService(client: ClientNumber, position: number)
{
    client.position = position;
    client.status = "In Service";

    const response = await fetch(process.env.NEXT_PUBLIC_API + apiPath, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(client),
    });
}

export async function getClients(): Promise<Array<ClientNumber>>
{
    const response = await fetch(process.env.NEXT_PUBLIC_API + apiPath, {
        method: "GET",
    });

    const data = await response.json();
    let res: Array<ClientNumber> = data;

    return res;
}

