"use client";

import { useAuthInfo } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { Header } from "shared-components";
import { useTranslations } from "next-intl";

export default function AdminDashboard() {
    const { data: userInfo } = useAuthInfo(axiosAuthInstance, { enabled: true });
    const t = useTranslations();

    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-8">
            <Header />

            <h1 className="text-4xl font-bold text-gray-800">{t("admin_dashboard")}</h1>

            <div className="text-xl text-gray-600">
                {userInfo ? userInfo.username : t("loading")}
            </div>
        </div>
    );
}
