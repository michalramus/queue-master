import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getOpeningHours, getMultilingualSettings } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import OpeningHoursClient from "./OpeningHoursClient";

export default async function OpeningHoursPage() {
    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ["openingHours"],
            queryFn: () => getOpeningHours(axiosAuthInstance),
        }),
        queryClient.prefetchQuery({
            queryKey: ["multilingualSettings"],
            queryFn: () => getMultilingualSettings(axiosPureInstance),
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <OpeningHoursClient />
        </HydrationBoundary>
    );
}
