"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Input, TopLoadingBar } from "shared-components";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { login } from "shared-utils";
import { isAxiosError } from "axios";

export default function LoginForm() {
    const t = useTranslations();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isIncorrectLoginData, setIsIncorrectLoginData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isServerError, setIsServerError] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsIncorrectLoginData(false);
        setIsServerError(false);
        setIsLoading(true);

        try {
            await login(username, password, axiosPureInstance);

            const redirect = searchParams.get("redirect");
            router.push(redirect ?? "/");
        } catch (error) {
            setIsLoading(false);
            if (isAxiosError(error) && error.response?.status === 401) {
                setIsIncorrectLoginData(true);
            } else {
                setIsServerError(true);
            }
        }
    }

    return (
        //TODO separate form to component
        <>
            <TopLoadingBar hidden={!isLoading} />
            <form className="mx-auto w-md" onSubmit={onSubmit}>
                <Input
                    label={t("username")}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mb-5"
                    disabled={isLoading}
                />
                <Input
                    label={t("password")}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-5"
                    disabled={isLoading}
                />

                <p className="mb-5 h-1.5 text-center">
                    {isIncorrectLoginData && (
                        <span className="text-red-2">{t("incorrect_login_or_password")}</span>
                    )}
                    {isServerError && (
                        <span className="text-red-2">{t("server_error_occurred")}</span>
                    )}
                </p>

                <Button
                    type="submit"
                    color={isLoading ? "gray" : "primary"}
                    disabled={isLoading}
                    className="float-right mx-0"
                >
                    {t("login")}
                </Button>
            </form>
        </>
    );
}
