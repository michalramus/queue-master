import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getCategories } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import CategoriesClient from "./CategoriesClient";

export default async function CategoriesPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(axiosAuthInstance),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CategoriesClient />
        </HydrationBoundary>
    );
}
