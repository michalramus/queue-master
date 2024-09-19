import { getClientsSSR } from "@/utils/api/SSR/clients";
import QueuePanel from "./QueuePanel";
import SmallHeader from "@/components/SmallHeader";
import { getInfoSSR } from "@/utils/api/SSR/auth";
import UserPanel from "./UserPanel";

export default async function SeatPage() {
    const clients = await getClientsSSR();
    const user = await (await getInfoSSR()).json();

    return (
        <main className="min-h-screen px-8 pb-24 pt-10 lg:px-10">
            <div className="flex flex-wrap justify-center sm:justify-between">
                <SmallHeader />
                <UserPanel
                    username={user.username}
                    adminButton={user.role === "Admin" ? true : false}
                />
            </div>
            <QueuePanel clients={clients} />
        </main>
    );
}
