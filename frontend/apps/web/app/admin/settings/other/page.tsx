import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getGlobalSettings, getMultilingualSettings } from "shared-utils";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { PageHeader } from "@/components/admin";
import { getTranslations } from "next-intl/server";
import OtherSettingsClient from "./OtherSettingsClient";

export default async function OtherSettingsPage() {
    const t = await getTranslations();
    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ["multilingualSettings"],
            queryFn: () => getMultilingualSettings(axiosPureInstance),
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <PageHeader title={t("global_settings")} />
            <OtherSettingsClient />
        </HydrationBoundary>
    );
}
