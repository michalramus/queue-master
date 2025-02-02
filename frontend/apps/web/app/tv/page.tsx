"use client";

import { ClientInterface } from "../../utils/api/CSR/clients";
import { useCallback, useEffect, useRef, useState } from "react";
import CurrentNumberWidget from "./CurrentNumberWidget";
import { io } from "socket.io-client";
import ClientNumbersHistory from "./ClientNumbersHistoryTable";
import { SmallHeader, Card } from "shared-components";
import { wsEvents } from "@/utils/wsEvents";
import useGlobalSettings from "@/utils/providers/GlobalSettingsProvider";

export default function TVPage() {
    const globalSettings = useGlobalSettings();
    const [currentClient, setCurrentClient] = useState<ClientInterface | null>(null);
    const currentClientRef = useRef<ClientInterface | null>(null);

    const [previousClients, setPreviousClients] = useState<ClientInterface[]>([]);
    const previousClientsRef = useRef<ClientInterface[] | null>(null);

    const [newClientsQueue, setNewClientsQueue] = useState<ClientInterface[]>([]);
    const isShowNewClientsRunning = useRef(false); //Protect from multiple calls at the same time - something like a mutex

    const maxHistory = 8; // TODO: Move to settings

    //Socket.io
    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL ?? "");

        function onClientToShow(client: ClientInterface) {
            setNewClientsQueue((e) => [...e, client]);
        }

        socket.on(wsEvents.ClientInService, onClientToShow);
        socket.on(wsEvents.ClientCallAgain, onClientToShow);
        return () => {
            socket.off(wsEvents.ClientInService, onClientToShow);
            socket.off(wsEvents.ClientCallAgain, onClientToShow);
        };
    }, []);

    //Update Refs
    useEffect(() => {
        currentClientRef.current = currentClient;
        previousClientsRef.current = previousClients;
    }, [currentClient, previousClients]);

    /**
     * Play audio and update previousClients and currentClient in order to show it on the screen
     * Function works in a loop until newClientsQueue is empty, but it's protected from multiple calls at the same time
     * If number is already in previousClients it won't be added again, but audio will be played
     */
    const showNewClients = useCallback(async () => {
        //Protect from multiple calls at the same time
        if (isShowNewClientsRunning.current) {
            return;
        }
        isShowNewClientsRunning.current = true;

        for (const client of newClientsQueue) {
            if (
                currentClientRef.current?.number != client.number &&
                previousClientsRef.current?.findIndex((e) => e.number === client.number) === -1
            ) {
                //Update previousClients and currentClient
                setPreviousClients((e) => {
                    const newClients = currentClientRef.current
                        ? [currentClientRef.current, ...e]
                        : [...e];
                    return newClients.slice(0, maxHistory);
                });
                setCurrentClient(client);
            }

            //Play audio
            const number = new Audio(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/audio-samples/" +
                    globalSettings.locale +
                    "/" +
                    client.category?.short_name +
                    client.number,
            );
            const seat = new Audio(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/audio-samples/" +
                    globalSettings.locale +
                    "/SEAT" +
                    client.seat,
            );
            number.play();
            await new Promise((resolve) => {
                number.onended = resolve;
            });
            seat.play();
            await new Promise((resolve) => {
                seat.onended = resolve;
            });

            setNewClientsQueue((e) => e.slice(1));
        }

        isShowNewClientsRunning.current = false;
    }, [
        currentClientRef,
        newClientsQueue,
        previousClientsRef,
        isShowNewClientsRunning,
        globalSettings.locale,
    ]);

    useEffect(() => {
        showNewClients();
    }, [newClientsQueue, showNewClients]);

    return (
        <main>
            <div className="fixed right-0 bottom-0 m-7">
                <SmallHeader />
            </div>
            <div className="flex h-screen flex-row flex-nowrap p-24">
                <ClientNumbersHistory clientNumbers={previousClients} />

                <Card className="mb-10 ml-10 flex w-6/12 items-center justify-center">
                    <CurrentNumberWidget
                        category_short_name={currentClient?.category?.short_name ?? ""}
                        number={currentClient?.number ?? ""}
                        seat={currentClient?.seat ?? ""}
                        className="w-full"
                    />
                </Card>
            </div>
        </main>
    );
}
