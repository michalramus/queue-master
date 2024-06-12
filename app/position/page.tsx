"use client";

import Header from "@/components/header";
import ClientRow from "./clientRow";
import { ClientNumber, getClients, setClientAsInService } from "@/api/clients";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
    const [clientsNumbers, setClientNumbers] = useState(Array<ClientNumber>);

    //Api data fetch
    useEffect(() => {
        const fetchData = async () => {
            const clients = await getClients();
            setClientNumbers(clients);
        };
        fetchData();
    }, []);

    //Socket.io
    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_WS_API ?? "");

        function onNewClient(client: ClientNumber) {
            setClientNumbers((clientNumbers) => [...clientNumbers, client]);
        }

        socket.on("newClient", onNewClient);
        return () => {
            socket.off("newClient", onNewClient);
        };
    }, []);

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
                                <th scope="col" className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientsNumbers.map((client) => (
                                <ClientRow
                                    key={client.number}
                                    category={client.category}
                                    number={client.number}
                                    onClick={(number) => {}}
                                ></ClientRow>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="w-6/12"></div>
            </div>
        </main>
    );
}
