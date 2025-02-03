"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/utils/api/CSR/auth";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "shared-components";
import { axiosInstance } from "@/utils/api/CSR/axiosInstances/axiosInstance";

export default function LoginForm() {
    const t = useTranslations();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isIncorrectLoginData, setIsIncorrectLoginData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isServerError, setIsServerError] = useState(false);

    async function onSubmit(event: any) {
        event.preventDefault();
        setIsIncorrectLoginData(false);
        setIsServerError(false);
        setIsLoading(true);

        const res = await login(
            event.target.username.value,
            event.target.password.value,
            axiosInstance,
        );
        if (res.status == 401) {
            setIsLoading(false);
            setIsIncorrectLoginData(true);
            setIsServerError(false);
        } else if (res.status != 201) {
            setIsLoading(false);
            setIsIncorrectLoginData(false);
            setIsServerError(true);
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
        <>
            <form className="mx-auto w-md" onSubmit={onSubmit}>
                <div className="mb-5">
                    <label htmlFor="username" className="mb-2 block text-sm font-medium">
                        {t("username")}
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="border-secondary-2 bg-secondary-1 focus:border-accent-1 focus:ring-accent-1 block w-full rounded-lg border p-2.5 text-sm"
                        required
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="mb-2 block text-sm font-medium">
                        {t("password")}
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="border-secondary-2 bg-secondary-1 focus:border-accent-1 focus:ring-accent-1 block w-full rounded-lg border p-2.5 text-sm"
                        required
                    />
                </div>

                <p className="mb-5 h-1.5 text-center">
                    {isLoading && t("loading")}
                    {isIncorrectLoginData && (
                        <span className="text-red-2">{t("incorrect_login_or_password")}</span>
                    )}
                    {isServerError && (
                        <span className="text-red-2">{t("server_error_occurred")}</span>
                    )}
                </p>

                <Button
                    type="submit"
                    color="primary"
                    className="float-right mx-0"
                    onClick={() => {}}
                >
                    {t("login")}
                </Button>
            </form>
        </>
    );
}
