"use client";

import Header from "@/components/Header";
import { ClientNumber } from "../../api/clients";
import { useEffect, useState } from "react";
import CurrentNumberWidget from "./CurrentNumberWidget";
import { io } from "socket.io-client";

export default function TVPage() {
    const [currentClient, setCurrentClient] = useState<ClientNumber | null>();

    //Socket.io
    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_WS_API ?? "");

        function onClientInService(client: ClientNumber) {
            setCurrentClient(client);
        }

        socket.on("clientInService", onClientInService);
        return () => {
            socket.off("clientInService", onClientInService);
        };
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <Header>Queue System</Header>
            <div className="flex w-full flex-row flex-wrap self-start pt-10">
                <CurrentNumberWidget
                    number={currentClient?.number ?? ""}
                    seat={currentClient?.seat ?? ""}
                />
                <div className="w-full pt-10 lg:w-6/12">
                    <p className="text-center text-2xl">Ogłoszenia</p>
                </div>
            </div>
        </main>
    );
}
