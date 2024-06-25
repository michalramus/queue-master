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

    const audio = new Audio(process.env.NEXT_PUBLIC_API + "/audio-samples/pl/" + client.number); //TODO: Move to settings
    audio.play();
    await new Promise((resolve, reject) => {
        audio.onerror = reject;
        audio.onended = resolve;
    });
}

export default function TVPage() {
    const [currentClient, setCurrentClient] = useState<ClientNumber | null>();

    const [previousClients, setPreviousClients] = useState<ClientNumber[]>([]);
    const [newClient, setNewClient] = useState<ClientNumber | null>();

    const maxHistory = 5; // TODO: Move to settings

    //Socket.io
    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_API ?? "");

        function onClientInService(client: ClientNumber) {
            setNewClient(client);
        }

        socket.on(wsClientEvents.ClientInService, onClientInService);
        return () => {
            socket.off(wsClientEvents.ClientInService, onClientInService);
        };
    }, []);

    /**
     * Play audio and update previousClients and currentClient in order to show it on the screen
     */
    function showNewClient() {
        let prevClients = previousClients; // Copy previousClients - useEffect updates are not immediate

        if (currentClient) {
            prevClients.unshift(currentClient);
        }

        if (prevClients.length > maxHistory) {
            prevClients = prevClients.slice(0, -1); // Remove last element
        }

        // Update states
        setCurrentClient(newClient);
        setPreviousClients(prevClients);

        playAudio(newClient!);

        setNewClient(null);
    }

    if (newClient) {
        showNewClient();
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
