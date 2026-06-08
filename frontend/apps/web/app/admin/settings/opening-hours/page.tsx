import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getOpeningHours } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import OpeningHoursClient from "./OpeningHoursClient";

export default async function OpeningHoursPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["openingHours"],
        queryFn: () => getOpeningHours(axiosAuthInstance),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <OpeningHoursClient />
        </HydrationBoundary>
    );
}
