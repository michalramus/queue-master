"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Card } from "shared-components";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { logout } from "shared-utils";

export default function UserPanel({
    username,
    adminButton,
}: {
    username: string;
    adminButton: boolean;
}) {
    const router = useRouter();
    const t = useTranslations();

    function logoutHandler() {
        logout(axiosPureInstance);
        router.replace("/login");
    }
    return (
        //TODO Add buttons onClick functionality
        <Card className="flex flex-nowrap items-center py-0!">
            <p className="mr-2">
                {t("user")}: {username}
            </p>
            {adminButton && (
                <Button onClick={() => {}} color="blue">
                    {t("admin_dashboard")}
                </Button>
            )}
            <Button onClick={() => {}} color="primary">
                {t("settings")}
            </Button>
            <Button
                color="red"
                onClick={() => {
                    logoutHandler();
                }}
            >
                {t("logout")}
            </Button>
        </Card>
    );
}
