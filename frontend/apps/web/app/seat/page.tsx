import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import QueuePanel from "./QueuePanel";

import UserPanel from "./UserPanel";

import { SmallHeader } from "shared-components";
import { getClients, getInfo, getUserSettings } from "shared-utils";

export default async function SeatPage() {
    const clients = await getClients(axiosAuthInstance);
    const user = (await getInfo(axiosAuthInstance)).data;
    const userSettings = await getUserSettings(axiosAuthInstance);

    return (
        <main className="min-h-screen px-8 pt-10 pb-24 lg:px-10">
            <div className="flex flex-wrap justify-center sm:justify-between">
                <SmallHeader />
                <UserPanel
                    username={user.username}
                    adminButton={user.role === "Admin" ? true : false}
                />
            </div>
            <QueuePanel clients={clients} userSettings={userSettings} />
        </main>
    );
}

export const dynamic = "force-dynamic";
