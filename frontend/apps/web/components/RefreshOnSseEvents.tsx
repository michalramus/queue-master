"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { sseEvents } from "shared-utils";
import { useSse } from "@/utils/hooks/useSse";

/**
 * Add a listener to the globalSettingsChange and ReloadFrontend SSE events and refresh the page when it happens
 * @returns null
 */
export default function RefreshOnSseEvents() {
    const router = useRouter();
    const { addEventListener, removeEventListener } = useSse();

    useEffect(() => {
        function onGlobalSettingsChanged() {
            router.refresh();
        }

        function onReloadFrontend() {
            router.refresh();
        }

        addEventListener(sseEvents.GlobalSettingsChanged, onGlobalSettingsChanged);
        addEventListener(sseEvents.ReloadFrontend, onReloadFrontend);

        return () => {
            removeEventListener(sseEvents.GlobalSettingsChanged, onGlobalSettingsChanged);
            removeEventListener(sseEvents.ReloadFrontend, onReloadFrontend);
        };
    }, [router, addEventListener, removeEventListener]);

    return null;
}
