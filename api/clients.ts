interface ClientNumber {
    number: number;
    category: string;
    status: string;
}

const apiPath = "/clients";

export async function addClient(category: string): Promise<ClientNumber> {
    let res: ClientNumber = {} as ClientNumber;

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
