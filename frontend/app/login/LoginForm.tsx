"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/utils/api/CSR/auth";
import { useState } from "react";
import Button from "@/components/Buttons/Button";

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(event: any) {
        event.preventDefault();
        setIsLoading(true);

        const res = await login(event.target.username.value, event.target.password.value);
        if (res.status != 201) {
            setIsLoading(false);
            setIsError(true);
        } else {
            const redirect = searchParams.get("redirect");

            if (redirect) {
                router.push(redirect);
            } else {
                router.push("/");
            }
        }
    }

    return (
        //TODO separate form to component
        <div>
            <form className="mx-auto max-w-sm" onSubmit={onSubmit}>
                <div className="mb-5">
                    <label htmlFor="username" className="mb-2 block text-sm font-medium">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="block w-full rounded-lg border border-secondary-2 bg-secondary-1 p-2.5 text-sm focus:border-accent-1 focus:ring-accent-1"
                        required
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="mb-2 block text-sm font-medium">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="block w-full rounded-lg border border-secondary-2 bg-secondary-1 p-2.5 text-sm focus:border-accent-1 focus:ring-accent-1"
                        required
                    />
                </div>
                {isLoading && <p className="mb-5 text-center">loading...</p>}
                {isError && (
                    <p className="mb-5 text-center text-red-2">Incorrect login or password</p>
                )}
                <Button type="submit" color="primary" className="mx-0" onClick={() => {}}>
                    Submit
                </Button>
            </form>
        </div>
    );
}
