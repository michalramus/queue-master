"use client";

import ClientTable from "./ClientTable";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import InServicePanel from "./InServicePanel";
import {
    ClientInterface,
    sseEvents,
    useWaitingClients,
    useInServiceClients,
    useUserSettings,
    useCategories,
} from "shared-utils";
import { Badge } from "shared-components";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { useSse } from "@/utils/hooks/useSse";
import { useTranslations } from "next-intl";
import { sendDesktopNotification } from "@/utils/sendDesktopNotification";

export default function QueuePanel({ clients }: { clients: ClientInterface[] }) {
    const categoryIds = [1, 2, 3, 4, 5, 6]; //TODO: get categoryIds from context | What if category will be removed after user settings are saved?

    const t = useTranslations();

    const queryClient = useQueryClient();
    const { addEventListener, removeEventListener, isConnected, backoffMs } = useSse();
    const showWarning = !isConnected && backoffMs >= 2000;

    const { data: userSettings } = useUserSettings(axiosAuthInstance, undefined, {
        enabled: true,
    });

    const desk = userSettings?.desk;
    const notifications_on = userSettings?.notifications_on ?? true;

    const { data: waitingClients } = useWaitingClients(axiosAuthInstance, {
        initialData: clients.filter((client) => client.status === "Waiting"),
    });

    const { data: inServiceClients } = useInServiceClients(axiosAuthInstance, desk, {
        initialData: clients.filter(
            (client) => client.status === "InService" && client.desk === desk,
        ),
    });

    const { data: categories } = useCategories(axiosAuthInstance);

    const waitingClientsFiltered = useMemo(
        () => waitingClients?.filter((client) => categoryIds.includes(client.category_id)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [waitingClients],
    );

    const activeCategoryBadges = useMemo(
        () => categories?.filter((cat) => categoryIds.includes(cat.id)) ?? [],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [categories],
    );

    //SSE update clients when clients changed
    useEffect(() => {
        function onClientModification() {
            queryClient.invalidateQueries({ queryKey: ["waitingClients"] });
            queryClient.invalidateQueries({ queryKey: ["inServiceClients", desk] });
        }

        addEventListener(sseEvents.ClientWaiting, onClientModification);
        addEventListener(sseEvents.ClientInService, onClientModification);
        addEventListener(sseEvents.ClientRemoved, onClientModification);

        return () => {
            removeEventListener(sseEvents.ClientWaiting, onClientModification);
            removeEventListener(sseEvents.ClientInService, onClientModification);
            removeEventListener(sseEvents.ClientRemoved, onClientModification);
        };
    }, [queryClient, desk, addEventListener, removeEventListener]);

    // Request notification permission on component mount
    useEffect(() => {
        if (typeof Notification !== "undefined" && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    // True when there were 0 waiting clients after last update, used to determine when to send notification about new client in empty queue
    const [wasZeroWaitingClients, setWasZeroWaitingClients] = useState(false);

    useEffect(() => {
        const count = waitingClientsFiltered?.length ?? 0;
        if (count === 0) {
            setWasZeroWaitingClients(true);
            return;
        }
        if (wasZeroWaitingClients && notifications_on) {
            setWasZeroWaitingClients(false);
            sendDesktopNotification("New client waiting", ``);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [waitingClientsFiltered]);

    return (
        <div className="flex flex-row flex-wrap-reverse justify-center self-start pt-10">
            <div className="w-full lg:w-6/12">
                {activeCategoryBadges.length > 0 && (
                    <div className="border-primary-1 mb-5 w-fit rounded-lg border-2 px-2">
                        <p>{t("active_categories")}</p>
                        <div className="mb-3 flex flex-wrap gap-2">
                            {activeCategoryBadges.map((cat) => (
                                <Badge key={cat.id} color="primary">
                                    {cat.short_name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
                {waitingClientsFiltered && (
                    <ClientTable
                        filteredClientNumbers={waitingClientsFiltered}
                        desk={desk ? desk : 1}
                    />
                )}
            </div>
            <div className="mb-5 flex w-full flex-col items-center lg:w-6/12">
                <div
                    className={`grid w-full transition-[grid-template-rows] duration-300 ease-in-out ${showWarning ? "mb-4 grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                    <div className="overflow-hidden">
                        <div className="border-yellow-1 rounded-lg border-2 px-4 py-3 text-center">
                            {t("sse_disconnected_warning")}
                        </div>
                    </div>
                </div>
                {inServiceClients && (
                    <InServicePanel
                        clientNumber={inServiceClients[0]}
                        nextClientNumber={waitingClientsFiltered?.[0]}
                        desk={desk ? desk : 1}
                    />
                )}
            </div>
        </div>
    );
}
