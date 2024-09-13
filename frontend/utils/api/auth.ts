const apiPath = "/auth";

export async function login(username: string, password: string) {
    const response = await fetch(process.env.NEXT_PUBLIC_API + apiPath + "/login", {
        method: "POST",
        body: JSON.stringify({
            username,
            password,
        }),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const res = await response.json();
    return res;
}

export async function refreshJWTToken() {
    const response = await fetch(process.env.NEXT_PUBLIC_API + apiPath + "/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const res = await response.json();
    return res;
}
