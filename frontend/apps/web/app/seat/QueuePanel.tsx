"use client";

import ClientTable from "./ClientTable";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import InServicePanel from "./InServicePanel";
import { ClientInterface, getClients, UserSettingsInterface, wsEvents } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";

export default function QueuePanel({
    clients,
    userSettings,
}: {
    clients: ClientInterface[];
    userSettings: UserSettingsInterface;
}) {
    let seat = userSettings.seat;
    let categoryIds = [1, 2, 3, 4, 5, 6]; //TODO: get categoryIds from context | What if category will be removed after user settings are saved?

    //React query clients fetch
    const queryClient = useQueryClient();

    //Api data fetch
    const { data: waitingClients } = useQuery({
        queryKey: ["waitingClients"],
        queryFn: () =>
            getClients(axiosAuthInstance).then((res) =>
                res.filter((client) => client.status === "Waiting"),
            ),
        initialData: clients.filter((client) => client.status === "Waiting"),
    });

    const { data: inServiceClients } = useQuery({
        queryKey: ["inServiceClients"],
        queryFn: () =>
            getClients(axiosAuthInstance).then((res) =>
                res.filter((client) => client.status === "InService" && client.seat === seat),
            ), //should be only one client in service per seat
        initialData: clients.filter(
            (client) => client.status === "InService" && client.seat === seat,
        ),
    });

    //Socket.io update clients when clients changed
    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL ?? "");

        function onClientModification(client: ClientInterface) {
            queryClient.invalidateQueries({ queryKey: ["waitingClients"] });
            queryClient.invalidateQueries({ queryKey: ["inServiceClients"] });
        }

        socket.on(wsEvents.ClientWaiting, onClientModification);
        socket.on(wsEvents.ClientInService, onClientModification);
        socket.on(wsEvents.ClientRemoved, onClientModification);
        return () => {
            socket.off(wsEvents.ClientWaiting, onClientModification);
            socket.off(wsEvents.ClientInService, onClientModification);
            socket.off(wsEvents.ClientRemoved, onClientModification);
        };
    }, [queryClient]);

    return (
        <div className="flex flex-row flex-wrap-reverse justify-center self-start pt-10">
            <div className="w-full lg:w-6/12">
                {waitingClients && (
                    <ClientTable
                        clientNumbers={waitingClients}
                        categoryIds={categoryIds}
                        seat={seat ? seat : 1}
                    />
                )}
            </div>
            {inServiceClients && (
                <div className="mb-5 flex w-full justify-center lg:w-6/12">
                    <InServicePanel
                        clientNumber={inServiceClients[0]}
                        nextClientNumber={waitingClients ? waitingClients[0] : undefined}
                        seat={seat ? seat : 1}
                    />
                </div>
            )}
        </div>
    );
}
