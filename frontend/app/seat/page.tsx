"use client";

import Header from "@/components/Header";
import ClientTable from "./ClientTable";
import {
    ClientNumber,
    getClients,
    setClientAsInService,
    wsClientEvents,
} from "@/utils/api/clients";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import InServicePanel from "./InServicePanel";

export default function SeatPage() {
    let seat = 1; //TODO: get seat from context
    let categoryIds = ["A", "B", "C", "D", "E", "F"]; //TODO: get categoryIds from context

    //React query clients fetch
    const queryClient = useQueryClient();

    //Api data fetch
    const { data: waitingClients, isLoading: isLoadingWaitingClients } = useQuery({
        queryKey: ["waitingClients"],
        queryFn: () =>
            getClients().then((res) => res.filter((client) => client.status === "Waiting")),
    });

    const { data: inServiceClients, isLoading: isLoadingInServiceClients } = useQuery({
        queryKey: ["inServiceClients"],
        queryFn: () =>
            getClients().then((res) =>
                res.filter((client) => client.status === "InService" && client.seat === seat),
            ), //should be only one client in service per seat
    });

    //Socket.io update clients when clients changed
    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_API ?? "");

        function onClientModification(client: ClientNumber) {
            queryClient.invalidateQueries({ queryKey: ["waitingClients"] });
            queryClient.invalidateQueries({ queryKey: ["inServiceClients"] });
        }

        socket.on(wsClientEvents.ClientWaiting, onClientModification);
        socket.on(wsClientEvents.ClientInService, onClientModification);
        socket.on(wsClientEvents.ClientRemoved, onClientModification);
        return () => {
            socket.off(wsClientEvents.ClientWaiting, onClientModification);
            socket.off(wsClientEvents.ClientInService, onClientModification);
            socket.off(wsClientEvents.ClientRemoved, onClientModification);
        };
    }, [queryClient]);

    return (
        <main className="pb24- min-h-screen px-10 pt-10 lg:px-24">
            <Header>Queue System</Header>
            <div className="flex flex-row flex-wrap-reverse justify-center self-start pt-10">
                <div className="w-full lg:w-6/12">
                    {isLoadingWaitingClients && <p>Loading...</p>}
                    {waitingClients && (
                        <ClientTable
                            clientNumbers={waitingClients}
                            categoryIds={categoryIds}
                            seat={seat}
                        />
                    )}
                </div>
                {inServiceClients && (
                    <div className="mb-5 flex w-full justify-center lg:w-6/12">
                        <InServicePanel
                            clientNumber={inServiceClients[0]}
                            nextClientNumber={waitingClients ? waitingClients[0] : undefined}
                            seat={seat}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
