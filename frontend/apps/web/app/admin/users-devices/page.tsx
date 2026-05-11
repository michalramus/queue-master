import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getUsers, getDevices, getAllUsersSettings } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import UsersDevicesClient from "./UsersDevicesClient";

export default async function UsersDevicesPage() {
    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ["users"],
            queryFn: () => getUsers(axiosAuthInstance),
        }),
        queryClient.prefetchQuery({
            queryKey: ["devices"],
            queryFn: () => getDevices(axiosAuthInstance),
        }),
        queryClient.prefetchQuery({
            queryKey: ["allUsersSettings"],
            queryFn: () => getAllUsersSettings(axiosAuthInstance),
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <UsersDevicesClient />
        </HydrationBoundary>
    );
}
