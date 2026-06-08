"use client";

import { useRouter } from "next/navigation";
import { SmallHeader } from "shared-components";
import { useTranslations } from "next-intl";

interface AdminHeaderProps {
    username?: string;
}

export default function AdminHeader({ username }: AdminHeaderProps) {
    const router = useRouter();
    const t = useTranslations();

    return (
        <div className="border-b border-gray-200 p-6">
            <div
                className="mb-4 cursor-pointer transition-opacity hover:opacity-80"
                onClick={() => router.push("/desk")}
            >
                <SmallHeader />
            </div>
            <div className="mt-4 rounded-lg bg-gray-100 p-3 text-center">
                <p className="text-sm font-medium text-gray-700">{username || t("loading")}</p>
            </div>
        </div>
    );
}
