"use client";

import { useRouter } from "next/navigation";
import { logout, useAuthInfo } from "shared-utils";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import Sidebar from "@/components/admin/Sidebar";
import { useTopLoadingBar } from "@/utils/providers/TopLoadingBarProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data: userInfo } = useAuthInfo(axiosAuthInstance, { enabled: true });
    const { show: showLoadingBar } = useTopLoadingBar();

    const handleLogout = async () => {
        try {
            showLoadingBar();
            await logout(axiosPureInstance);
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="flex min-h-screen items-start bg-gray-50">
            <Sidebar username={userInfo?.username} onLogout={handleLogout} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
