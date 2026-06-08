"use client";

import { useTranslations } from "next-intl";
import { Button } from "shared-components";
import SidebarItem from "./SidebarItem";
import AdminHeader from "./AdminHeader";

interface SidebarProps {
    username?: string;
    onLogout: () => void;
}

export default function Sidebar({ username, onLogout }: SidebarProps) {
    const t = useTranslations();

    return (
        <aside className="sticky top-0 flex h-screen w-64 flex-shrink-0 flex-col bg-white shadow-lg">
            <AdminHeader username={username} />

            <nav className="flex-1 overflow-y-auto">
                <SidebarItem href="/admin" label={t("dashboard")} />
                <SidebarItem href="/admin/users-devices" label={t("users_and_devices")} />
                <SidebarItem href="/admin/categories" label={t("categories")} />
                <SidebarItem
                    href="/admin/settings"
                    label={t("settings")}
                    subItems={[
                        { href: "/admin/settings/visual", label: t("visual") },
                        { href: "/admin/settings/opening-hours", label: t("opening_hours") },
                        { href: "/admin/settings/other", label: t("other") },
                    ]}
                />
            </nav>

            <div className="border-t border-gray-200 p-4">
                <Button onClick={onLogout} color="red" className="m-0! w-full">
                    {t("logout")}
                </Button>
            </div>
        </aside>
    );
}
