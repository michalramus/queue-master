"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { wsEvents } from "@/utils/wsEvents";

/**
 * Add a listener to the globalSettingsChange websocket event and refresh the page when it happens
 * @returns null
 */
export default function RefreshOnGlobalSettingsChanged() {
    const router = useRouter();

    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL ?? "");

        function onGlobalSettingsChanged() {
            router.refresh();
        }

        socket.on(wsEvents.GlobalSettingsChanged, onGlobalSettingsChanged);
        return () => {
            socket.off(wsEvents.GlobalSettingsChanged, onGlobalSettingsChanged);
        };
    }, [router]);

    return null;
}
