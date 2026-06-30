"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Card } from "shared-components";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { logout } from "shared-utils";
import { useTopLoadingBar } from "@/utils/providers/TopLoadingBarProvider";
import UserSettingsModal from "./UserSettingsModal";

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
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

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
        <Card className="flex flex-col items-center py-2! sm:flex-row sm:py-0!">
            <p className="mb-1 text-xs whitespace-nowrap sm:mr-2 sm:mb-0 sm:text-sm">
                {t("user")}: {username}
            </p>
            <div className="flex flex-nowrap items-center">
                {adminButton && (
                    <Button
                        onClick={handleAdminClick}
                        color="blue"
                        className="text-xs! whitespace-nowrap sm:text-sm!"
                    >
                        {t("admin_dashboard")}
                    </Button>
                )}
                <Button
                    onClick={() => setIsSettingsModalOpen(true)}
                    color="primary"
                    className="text-xs! whitespace-nowrap sm:text-sm!"
                >
                    {t("settings")}
                </Button>
                <Button
                    color="red"
                    onClick={handleLogout}
                    className="text-xs! whitespace-nowrap sm:text-sm!"
                >
                    {t("logout")}
                </Button>
            </div>
            <UserSettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
            />
        </Card>
    );
}
