"use client";
import { logout } from "@/utils/api/CSR/auth";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Card } from "shared-components";

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
        logout();
        router.replace("/login");
    }
    return (
        <Card className="flex flex-nowrap items-center !py-0">
            <p className="mr-2">
                {t("user")}: {username}
            </p>
            {adminButton && <Button color="blue">{t("admin_dashboard")}</Button>}
            <Button color="primary">{t("settings")}</Button>
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
