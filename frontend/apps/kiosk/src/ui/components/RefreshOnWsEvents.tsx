import { useEffect } from "react";
import { io } from "socket.io-client";
import { wsEvents } from "shared-utils";
import useAppConfig from "@/utils/providers/AppConfigProvider";

/**
 * Add a listener to the globalSettingsChange websocket event and refresh the page when it happens
 * @returns null
 */
export default function RefreshOnWsEvents() {
    const appConfig = useAppConfig();

    useEffect(() => {
        const socket = io(appConfig.backendUrl);

        function onGlobalSettingsChanged() {
            window.location.reload();
        }

        function onReloadFrontend() {
            window.location.reload();
        }

        socket.on(wsEvents.GlobalSettingsChanged, onGlobalSettingsChanged);
        socket.on(wsEvents.ReloadFrontend, onReloadFrontend);
        return () => {
            socket.off(wsEvents.GlobalSettingsChanged, onGlobalSettingsChanged);
            socket.off(wsEvents.ReloadFrontend, onReloadFrontend);
        };
    }, [appConfig.backendUrl]);

    return null;
}
