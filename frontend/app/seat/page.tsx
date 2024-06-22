"use client";

import Header from "@/components/Header";
import ClientTable from "./ClientTable";
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

        function onClientModification(client: ClientNumber) {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
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
            <div className="flex flex-row flex-wrap self-start pt-10">
                <div className="w-full lg:w-6/12">
                    {isLoading && <p>Loading...</p>}
                    {clients && (
                        <ClientTable
                            clientNumbers={clients}
                            categoryIds={categoryIds}
                            seat={seat}
                        />
                    )}
                </div>
                <div className="w-full lg:w-6/12">
                    <a
                        href="#"
                        className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Noteworthy technology acquisitions 2021
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            Here are the biggest enterprise technology acquisitions of 2021 so far,
                            in reverse chronological order.
                        </p>
                    </a>

                    <button
                        type="button"
                        className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Default
                    </button>
                    <button
                        type="button"
                        className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Default
                    </button>
                    <button
                        type="button"
                        className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Default
                    </button>
                </div>
            </div>
        </main>
    );
}
