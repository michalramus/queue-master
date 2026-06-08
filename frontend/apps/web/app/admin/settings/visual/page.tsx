import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getGlobalSettings, getLogoAvailability } from "shared-utils";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { PageHeader } from "@/components/admin";
import { getTranslations } from "next-intl/server";
import ColorManagement from "./ColorManagement";
import LogoManagement from "./LogoManagement";

export default async function VisualSettingsPage() {
    const t = await getTranslations();
    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ["globalSettings"],
            queryFn: () => getGlobalSettings(axiosPureInstance),
        }),
        queryClient.prefetchQuery({
            queryKey: ["logoAvailabilities"],
            queryFn: () => getLogoAvailability(axiosPureInstance),
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <PageHeader title={t("visual_settings")} />
            <ColorManagement />
            <LogoManagement />
        </HydrationBoundary>
    );
}
