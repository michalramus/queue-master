import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getDesks } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import DesksClient from "./DesksClient";

export default async function DesksPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["desks"],
        queryFn: () => getDesks(axiosAuthInstance),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DesksClient />
        </HydrationBoundary>
    );
}
