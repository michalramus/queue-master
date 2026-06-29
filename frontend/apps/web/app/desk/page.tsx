import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import QueuePanel from "./QueuePanel";

import UserPanel from "./UserPanel";

import { SmallHeader } from "shared-components";
import { getClients, getUserSettings } from "shared-utils";
import { getCachedAuthInfo } from "@/utils/server/getCachedAuthInfo";

export default async function DeskPage() {
    const queryClient = new QueryClient();

    const [clients, user] = await Promise.all([
        getClients(axiosAuthInstance),
        getCachedAuthInfo(),
        queryClient.prefetchQuery({
            queryKey: ["userSettings"],
            queryFn: () => getUserSettings(axiosAuthInstance),
        }),
    ]);

    const deskId = user?.default_desk?.id;

    if (user) {
        queryClient.setQueryData(["authInfo"], user);
    }
    queryClient.setQueryData(
        ["waitingClients"],
        clients.filter((c) => c.status === "Waiting"),
    );
    if (deskId !== undefined) {
        queryClient.setQueryData(
            ["inServiceClients", deskId],
            clients.filter((c) => c.status === "InService" && c.desk?.id === deskId),
        );
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <main className="min-h-screen px-8 pt-10 pb-24 lg:px-10">
                <div className="flex flex-wrap justify-center sm:justify-between">
                    <SmallHeader />
                    <UserPanel
                        username={user?.username || "Loading..."}
                        adminButton={user?.role === "Admin" ? true : false}
                    />
                </div>
                <QueuePanel clients={clients} />
            </main>
        </HydrationBoundary>
    );
}

export const dynamic = "force-dynamic";
