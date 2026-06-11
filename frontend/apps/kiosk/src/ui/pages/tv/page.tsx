import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CurrentNumberWidget from "./CurrentNumberWidget";
import ClientNumbersHistory from "./ClientNumbersHistoryTable";
import { SmallHeader, Card } from "shared-components";
import {
    ClientInterface,
    sseEvents,
    LogoID,
    MultilingualSettingsInterface,
    OpeningHoursDto,
    useGlobalSettings,
} from "shared-utils";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import OpeningHoursWidget from "@/components/OpeningHoursWidget";
import { useAppConfig } from "@/utils/hooks/useAppConfig";
import { useLogoManagement } from "@/utils/hooks/useLogoManagement";
import { useSse } from "@/utils/hooks/useSse";

interface TVPageProps {
    kioskOpen: boolean;
    openingHours: OpeningHoursDto[];
    multilingualSettings?: MultilingualSettingsInterface;
}

export default function TVPage({ kioskOpen, openingHours, multilingualSettings }: TVPageProps) {
    const { i18n } = useTranslation();
    const { data: appConfig } = useAppConfig();
    const { data: globalSettings } = useGlobalSettings(axiosPureInstance);

    const [currentClient, setCurrentClient] = useState<ClientInterface | null>(null);
    const currentClientRef = useRef<ClientInterface | null>(null);

    const [previousClients, setPreviousClients] = useState<ClientInterface[]>([]);
    const previousClientsRef = useRef<ClientInterface[] | null>(null);

    const [newClientsQueue, setNewClientsQueue] = useState<ClientInterface[]>([]);
    const isShowNewClientsRunning = useRef(false); //Protect from multiple calls at the same time - something like a mutex

    const maxHistory = 20; // max stored history of clients. Clients are automatically trimmed to match screen size in ClientNumbersHistoryTable component

    const { mainLogoUrl, secondaryLogoUrl } = useLogoManagement(
        LogoID.logo_tv_main,
        LogoID.logo_tv_secondary,
    );

    const { addEventListener, removeEventListener } = useSse();

    //SSE
    useEffect(() => {
        function onClientToShow(event: MessageEvent) {
            const client: ClientInterface = JSON.parse(event.data);
            setNewClientsQueue((e) => [...e, client]);
        }

        addEventListener(sseEvents.ClientInService, onClientToShow);
        addEventListener(sseEvents.ClientCallAgain, onClientToShow);

        return () => {
            removeEventListener(sseEvents.ClientInService, onClientToShow);
            removeEventListener(sseEvents.ClientCallAgain, onClientToShow);
        };
    }, [addEventListener, removeEventListener]);

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
            // Switch language if auto-switch is enabled
            if (globalSettings?.tv_auto_switch_language && client.language) {
                await i18n.changeLanguage(client.language);
            }

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
    }, [newClientsQueue, globalSettings, i18n]);

    useEffect(() => {
        showNewClients();
    }, [newClientsQueue, showNewClients]);

    return (
        <main className="overflow-hidden">
            <div className="fixed right-0 bottom-0 m-7">
                <SmallHeader />
            </div>
            <div className="h-screen">
                <div className="ml-7 flex max-h-16 max-w-md items-center gap-8 pt-7">
                    {mainLogoUrl !== null && (
                        <img
                            src={mainLogoUrl}
                            alt="TV Main Logo"
                            className="max-h-16 w-auto object-contain"
                        />
                    )}
                    {secondaryLogoUrl !== null && (
                        <img
                            src={secondaryLogoUrl}
                            alt="TV Secondary Logo"
                            className="max-h-16 w-auto object-contain"
                        />
                    )}
                </div>
                <div className="flex h-11/12 flex-row flex-nowrap px-24 pt-9 pb-28">
                    {kioskOpen || !appConfig?.openingHoursEnableBanner ? (
                        <>
                            <Card className="mb-10 ml-10 flex w-6/12 items-center justify-center">
                                <CurrentNumberWidget
                                    category_short_name={currentClient?.category?.short_name ?? ""}
                                    number={currentClient?.number ?? ""}
                                    desk={currentClient?.desk ?? ""}
                                    className="w-full"
                                />
                            </Card>
                            <ClientNumbersHistory clientNumbers={previousClients} />
                        </>
                    ) : (
                        <div className="flex w-full items-center justify-center">
                            <OpeningHoursWidget
                                openingHours={openingHours || []}
                                multilingualSettings={multilingualSettings}
                                className="w-full max-w-3xl"
                                large={true}
                            />
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
