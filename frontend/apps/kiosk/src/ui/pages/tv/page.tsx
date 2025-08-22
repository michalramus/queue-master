import { useCallback, useEffect, useRef, useState } from "react";
import CurrentNumberWidget from "./CurrentNumberWidget";
import { io } from "socket.io-client";
import ClientNumbersHistory from "./ClientNumbersHistoryTable";
import { SmallHeader, Card } from "shared-components";
import {
    ClientInterface,
    wsEvents,
    getLogoAvailability,
    LogoID,
    OpeningHoursDto,
} from "shared-utils";
import useAppConfig from "@/utils/providers/AppConfigProvider";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { useQuery } from "@tanstack/react-query";
import OpeningHoursWidget from "@/components/OpeningHoursWidget";

interface TVPageProps {
    kioskOpen: boolean;
    openingHours: OpeningHoursDto[];
}

export default function TVPage({ kioskOpen, openingHours }: TVPageProps) {
    const appConfig = useAppConfig();

    const [currentClient, setCurrentClient] = useState<ClientInterface | null>(null);
    const currentClientRef = useRef<ClientInterface | null>(null);

    const [previousClients, setPreviousClients] = useState<ClientInterface[]>([]);
    const previousClientsRef = useRef<ClientInterface[] | null>(null);

    const [newClientsQueue, setNewClientsQueue] = useState<ClientInterface[]>([]);
    const isShowNewClientsRunning = useRef(false); //Protect from multiple calls at the same time - something like a mutex

    const maxHistory = 20; // max stored history of clients. Clients are automatically trimmed to match screen size in ClientNumbersHistoryTable component

    // Logo availability query
    const { data: logoAvailabilities } = useQuery({
        queryKey: ["TVPage_logoAvailabilities"],
        queryFn: () => getLogoAvailability(axiosPureInstance),
    });

    //Socket.io
    useEffect(() => {
        const socket = io(appConfig.backendUrl);

        function onClientToShow(client: ClientInterface) {
            setNewClientsQueue((e) => [...e, client]);
        }

        socket.on(wsEvents.ClientInService, onClientToShow);
        socket.on(wsEvents.ClientCallAgain, onClientToShow);
        return () => {
            socket.off(wsEvents.ClientInService, onClientToShow);
            socket.off(wsEvents.ClientCallAgain, onClientToShow);
        };
    }, [appConfig.backendUrl]);

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
            await window.electronAPI.invokeAudioSynthesizer(client);

            setNewClientsQueue((e) => e.slice(1));
        }

        isShowNewClientsRunning.current = false;
    }, [newClientsQueue]);

    useEffect(() => {
        showNewClients();
    }, [newClientsQueue, showNewClients]);

    return (
        <main>
            <div className="fixed right-0 bottom-0 mr-7 mb-7 flex w-6/12 items-center justify-end gap-8">
                {logoAvailabilities?.includes(LogoID.logo_tv_secondary) && (
                    <img
                        src={`${appConfig.backendUrl}/file/logo/${LogoID.logo_tv_secondary}`}
                        alt="TV Secondary Logo"
                        className="max-h-20 w-auto object-contain"
                    />
                )}
                {logoAvailabilities?.includes(LogoID.logo_tv_main) && (
                    <img
                        src={`${appConfig.backendUrl}/file/logo/${LogoID.logo_tv_main}`}
                        alt="TV Main Logo"
                        className="max-h-20 w-auto object-contain"
                    />
                )}
                <SmallHeader />
            </div>
            <div className="flex h-screen flex-row flex-nowrap px-24 pt-20 pb-28">
                {kioskOpen || !appConfig.opening_hours_enable_banner ? (
                    <>
                        <ClientNumbersHistory clientNumbers={previousClients} />
                        <Card className="mb-10 ml-10 flex w-6/12 items-center justify-center">
                            <CurrentNumberWidget
                                category_short_name={currentClient?.category?.short_name ?? ""}
                                number={currentClient?.number ?? ""}
                                seat={currentClient?.seat ?? ""}
                                className="w-full"
                            />
                        </Card>
                    </>
                ) : (
                    <div className="flex w-full items-center justify-center">
                        <OpeningHoursWidget
                            openingHours={openingHours || []}
                            className="w-full max-w-3xl"
                            large={true}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
