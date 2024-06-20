"use client";

import Header from "@/components/Header";
import ClientTableRow from "./ClientTableRow";
import { ClientNumber, getClients, setClientAsInService, wsClientEvents } from "@/api/clients";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function SeatPage() {
    const seat = 1; //TODO: get seat from context
    const categoryIds = ["A", "B", "C", "D", "E", "F"]; //TODO: get categoryIds from context

    //React query clients fetch
    const queryClient = useQueryClient();

    //Api data fetch
    const { data: clients, isLoading } = useQuery({
        queryKey: ["clients"],
        queryFn: () =>
            getClients().then((res) => res.filter((client) => client.status === "Waiting")),
    });

    //Socket.io update clients when clients changed
    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_API ?? "");

        function onClient(client: ClientNumber) {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        }

        socket.on(wsClientEvents.ClientWaiting, onClient);
        socket.on(wsClientEvents.ClientInService, onClient); //FixMe
        return () => {
            socket.off(wsClientEvents.ClientWaiting, onClient);
            socket.off(wsClientEvents.ClientInService, onClient);
        };
    }, [queryClient]);

    return (
        <main className="pb24- min-h-screen px-10 pt-10 lg:px-24">
            <Header>Queue System</Header>
            <div className="flex flex-row flex-wrap self-start pt-10">
                <div className="w-full overflow-x-auto shadow-md sm:rounded-lg lg:w-6/12">
                    <table className="w-full text-center text-sm text-gray-400 rtl:text-right">
                        <thead className="bg-gray-700 text-xs uppercase text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Number
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Creation Date
                                </th>
                                <th scope="col" className="px-6 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {clients?.map((client) => {
                                if (categoryIds.includes(client.categoryId)) {
                                    return (
                                        <ClientTableRow
                                            key={client.number}
                                            clientNumber={client}
                                            seat={seat}
                                        />
                                    );
                                }
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="w-full lg:w-6/12" />
            </div>
        </main>
    );
}
