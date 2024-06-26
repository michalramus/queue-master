"use client";

import Header from "@/components/Header";
import { ClientNumber } from "../../api/clients";
import { useEffect, useState } from "react";
import CurrentNumberWidget from "./CurrentNumberWidget";
import { io } from "socket.io-client";
import { wsClientEvents } from "@/api/clients";
import ClientNumbersHistory from "./ClientNumbersHistoryTable";

async function playAudio(client: ClientNumber) {
    //TODO wait for audio to finish
}

export default function TVPage() {
    const [currentClient, setCurrentClient] = useState<ClientNumber | null>();

    const [previousClients, setPreviousClients] = useState<ClientNumber[]>([]);

    const [newClientsQueue, setNewClientsQueue] = useState<ClientNumber[]>([]);
    const [running, setRunning] = useState(false);
    let run = false;

    const maxHistory = 5; // TODO: Move to settings

    //Socket.io
    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_API ?? "");

        function onClientInService(client: ClientNumber) {
            setNewClientsQueue((e) => [...e, client]);
        }

        socket.on(wsClientEvents.ClientInService, onClientInService);
        return () => {
            socket.off(wsClientEvents.ClientInService, onClientInService);
        };
    }, []);

    useEffect(() => {
        showNewClients();
    }, [newClientsQueue]);

    /**
     * Play audio and update previousClients and currentClient in order to show it on the screen
     */
    async function showNewClients() {
        console.log("begin");

        if (run) {
            return;
        }

        run = true;

        if (running) {
            return;
        }
        setRunning(true);

        

        for (const client of newClientsQueue) {
            if (currentClient) {
                setPreviousClients((e) => [currentClient, ...e].slice(0, maxHistory));
            }
            setCurrentClient(client);


            console.log("current client", currentClient?.number , " next client", client.number);

            const number = new Audio(
                process.env.NEXT_PUBLIC_API + "/audio-samples/pl/" + client.number,
            ); //TODO: Move to settings
            const seat = new Audio(
                process.env.NEXT_PUBLIC_API + "/audio-samples/pl/" + "SEAT" + client.seat,
            ); //TODO: Move to settings
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

        setRunning(false);
        run = false;
        console.log("end");
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <Header>Queue System</Header>
            <div className="flex w-full flex-row flex-wrap self-start pt-10">
                <div className="w-full lg:w-6/12">
                    <CurrentNumberWidget
                        number={currentClient?.number ?? ""}
                        seat={currentClient?.seat ?? ""}
                        className="mb-2"
                    />
                    <ClientNumbersHistory clientNumbers={previousClients} />
                </div>
                <div className="w-full pt-10 lg:w-6/12">
                    <p className="text-center text-2xl">Ogłoszenia</p>
                </div>
            </div>
        </main>
    );
}
