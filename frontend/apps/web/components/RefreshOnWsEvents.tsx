"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { wsEvents } from "shared-utils";

/**
 * Add a listener to the globalSettingsChange and ReloadFrontend websocket events and refresh the page when it happens
 * @returns null
 */
export default function RefreshOnWsEvents() {
    const router = useRouter();

    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL ?? "");

        function onGlobalSettingsChanged() {
            router.refresh();
        }

        function onReloadFrontend() {
            router.refresh();
        }

        socket.on(wsEvents.GlobalSettingsChanged, onGlobalSettingsChanged);
        socket.on(wsEvents.ReloadFrontend, onReloadFrontend);
        return () => {
            socket.off(wsEvents.GlobalSettingsChanged, onGlobalSettingsChanged);
            socket.off(wsEvents.ReloadFrontend, onReloadFrontend);
        };
    }, [router]);

    return null;
}
