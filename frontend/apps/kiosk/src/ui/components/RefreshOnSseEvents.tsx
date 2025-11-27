import { useEffect } from "react";
import { sseEvents } from "shared-utils";
import { useSse } from "@/utils/hooks/useSse";

/**
 * Add a listener to the globalSettingsChange SSE event and refresh the page when it happens
 * @returns null
 */
export default function RefreshOnSseEvents() {
    const { addEventListener, removeEventListener } = useSse();

    useEffect(() => {
        function onGlobalSettingsChanged() {
            window.location.reload();
        }

        function onReloadFrontend() {
            window.location.reload();
        }

        addEventListener(sseEvents.GlobalSettingsChanged, onGlobalSettingsChanged);
        addEventListener(sseEvents.ReloadFrontend, onReloadFrontend);

        return () => {
            removeEventListener(sseEvents.GlobalSettingsChanged, onGlobalSettingsChanged);
            removeEventListener(sseEvents.ReloadFrontend, onReloadFrontend);
        };
    }, [addEventListener, removeEventListener]);

    return null;
}
