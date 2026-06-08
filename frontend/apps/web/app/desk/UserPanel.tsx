"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Card } from "shared-components";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { logout } from "shared-utils";
import { useTopLoadingBar } from "@/utils/providers/TopLoadingBarProvider";

export default function UserPanel({
    username,
    adminButton,
}: {
    username: string;
    adminButton: boolean;
}) {
    const router = useRouter();
    const t = useTranslations();
    const { show: showLoadingBar } = useTopLoadingBar();

    const handleLogout = async () => {
        showLoadingBar();
        await logout(axiosPureInstance);
        router.replace("/login");
    };

    const handleAdminClick = () => {
        showLoadingBar();
        router.push("/admin");
    };

    return (
        //TODO Add buttons onClick functionality
        <Card className="flex flex-nowrap items-center py-0!">
            <p className="mr-2">
                {t("user")}: {username}
            </p>
            {adminButton && (
                <Button onClick={handleAdminClick} color="blue">
                    {t("admin_dashboard")}
                </Button>
            )}
            <Button onClick={() => {}} color="primary">
                {t("settings")}
            </Button>
            <Button color="red" onClick={handleLogout}>
                {t("logout")}
            </Button>
        </Card>
    );
}
