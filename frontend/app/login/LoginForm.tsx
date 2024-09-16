"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/utils/api/CSR/auth";
import { useState } from "react";

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
        <div>
            <form className="mx-auto max-w-sm" onSubmit={onSubmit}>
                <div className="mb-5">
                    <label
                        htmlFor="username"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-5">
                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Submit
                </button>
            </form>
            {isLoading && <p>loading...</p>}
            {isError && <p>Incorrect login or password</p>}
        </div>
    );
}
