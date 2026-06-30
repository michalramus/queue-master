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
    useAuthInfo,
    useDesk,
} from "shared-utils";
import { Badge } from "shared-components";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { useSse } from "@/utils/hooks/useSse";
import { useTranslations } from "next-intl";
import { sendDesktopNotification } from "@/utils/sendDesktopNotification";

export default function QueuePanel({ clients }: { clients: ClientInterface[] }) {
    const t = useTranslations();

    const queryClient = useQueryClient();
    const { addEventListener, removeEventListener, isConnected, backoffMs } = useSse();
    const showWarning = !isConnected && backoffMs >= 2000;

    const { data: authInfo } = useAuthInfo(axiosAuthInstance, { enabled: true });
    const { data: userSettings } = useUserSettings(axiosAuthInstance, undefined, {
        enabled: true,
    });

    const deskId = authInfo?.default_desk?.id;
    const deskName = authInfo?.default_desk?.desk_name;

    const { data: currentDesk } = useDesk(axiosAuthInstance, deskId);
    const categoryIds = useMemo(
        () => currentDesk?.categories?.map((c) => c.id) ?? [],
        [currentDesk],
    );
    const notifications_on = userSettings?.notifications_on ?? true;

    const { data: waitingClients } = useWaitingClients(axiosAuthInstance, {
        initialData: clients.filter((client) => client.status === "Waiting"),
    });

    const { data: inServiceClients } = useInServiceClients(axiosAuthInstance, deskId, {
        initialData: [],
    });

    const { data: categories } = useCategories(axiosAuthInstance);

    const waitingClientsFiltered = useMemo(
        () => waitingClients?.filter((client) => categoryIds.includes(client.category_id)),
        [waitingClients, categoryIds],
    );

    const activeCategoryBadges = useMemo(
        () => categories?.filter((cat) => categoryIds.includes(cat.id)) ?? [],
        [categories, categoryIds],
    );

    //SSE update clients when clients changed
    useEffect(() => {
        function onClientModification() {
            queryClient.invalidateQueries({ queryKey: ["waitingClients"] });
            queryClient.invalidateQueries({ queryKey: ["inServiceClients", deskId] });
        }

        function onCategoriesChanged() {
            queryClient.invalidateQueries({ queryKey: ["authInfo"] });
            queryClient.invalidateQueries({ queryKey: ["desk", deskId] });
        }

        function onUserChanged(event: MessageEvent) {
            const data = JSON.parse(event.data as string) as { userId: number };
            if (data.userId === authInfo?.id) {
                queryClient.invalidateQueries({ queryKey: ["authInfo"] });
            }
        }

        addEventListener(sseEvents.ClientWaiting, onClientModification);
        addEventListener(sseEvents.ClientInService, onClientModification);
        addEventListener(sseEvents.ClientRemoved, onClientModification);
        addEventListener(sseEvents.CategoriesChanged, onCategoriesChanged);
        addEventListener(sseEvents.UserChanged, onUserChanged);

        return () => {
            removeEventListener(sseEvents.ClientWaiting, onClientModification);
            removeEventListener(sseEvents.ClientInService, onClientModification);
            removeEventListener(sseEvents.ClientRemoved, onClientModification);
            removeEventListener(sseEvents.CategoriesChanged, onCategoriesChanged);
            removeEventListener(sseEvents.UserChanged, onUserChanged);
        };
    }, [queryClient, deskId, authInfo, addEventListener, removeEventListener]);

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
            <div className="w-full min-w-0 xl:w-6/12">
                {authInfo && !deskId ? (
                    <div className="border-yellow-1 mb-5 w-fit rounded-lg border-2 px-3 py-2">
                        <p className="text-text-1 font-semibold">{t("no_desk_assigned")}</p>
                        <p className="text-text-2 text-sm">{t("no_desk_assigned_description")}</p>
                    </div>
                ) : deskName || activeCategoryBadges.length > 0 ? (
                    <div className="border-primary-1 mb-5 flex w-fit items-center gap-4 rounded-lg border-2 px-2 py-2">
                        {deskName && <p className="text-text-1 font-semibold">{deskName}</p>}
                        <p>{t("active_categories")}</p>
                        {activeCategoryBadges.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {activeCategoryBadges.map((cat) => (
                                    <Badge key={cat.id} color="primary">
                                        {cat.short_name}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-text-2 text-sm">{t("no_active_categories")}</p>
                        )}
                    </div>
                ) : null}
                {waitingClientsFiltered && (
                    <ClientTable
                        filteredClientNumbers={waitingClientsFiltered}
                        deskId={deskId ?? 0}
                    />
                )}
            </div>
            <div className="mb-5 flex w-full flex-col items-center xl:w-6/12">
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
                        deskId={deskId ?? 0}
                    />
                )}
            </div>
        </div>
    );
}
