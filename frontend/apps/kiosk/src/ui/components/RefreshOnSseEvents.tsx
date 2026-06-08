import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { sseEvents } from "shared-utils";
import { useSse } from "@/utils/hooks/useSse";

/**
 * Listen to SSE events and invalidate appropriate queries instead of full page reload
 * @returns null
 */
export default function RefreshOnSseEvents() {
    const { addEventListener, removeEventListener } = useSse();
    const queryClient = useQueryClient();

    useEffect(() => {
        function onGlobalSettingsChanged() {
            queryClient.invalidateQueries({ queryKey: ["globalSettings"] });
        }

        function onMultilingualSettingsChanged() {
            queryClient.invalidateQueries({ queryKey: ["multilingualSettings"] });
        }

        function onCategoriesChanged() {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        }

        function onOpeningHoursChanged() {
            queryClient.invalidateQueries({ queryKey: ["openingHours"] });
        }

        function onLogoAvailabilityChanged() {
            queryClient.invalidateQueries({ queryKey: ["logoAvailabilities"] });
        }

        function onClientsFlushed() {
            queryClient.invalidateQueries({ queryKey: ["waitingClients"] });
            queryClient.invalidateQueries({ queryKey: ["inServiceClients"] });
        }

        function onReloadFrontend() {
            window.location.reload();
        }

        addEventListener(sseEvents.GlobalSettingsChanged, onGlobalSettingsChanged);
        addEventListener(sseEvents.MultilingualSettingsChanged, onMultilingualSettingsChanged);
        addEventListener(sseEvents.CategoriesChanged, onCategoriesChanged);
        addEventListener(sseEvents.OpeningHoursChanged, onOpeningHoursChanged);
        addEventListener(sseEvents.LogoAvailabilityChanged, onLogoAvailabilityChanged);
        addEventListener(sseEvents.ClientsFlushed, onClientsFlushed);
        addEventListener(sseEvents.ReloadFrontend, onReloadFrontend);

        return () => {
            removeEventListener(sseEvents.GlobalSettingsChanged, onGlobalSettingsChanged);
            removeEventListener(
                sseEvents.MultilingualSettingsChanged,
                onMultilingualSettingsChanged,
            );
            removeEventListener(sseEvents.CategoriesChanged, onCategoriesChanged);
            removeEventListener(sseEvents.OpeningHoursChanged, onOpeningHoursChanged);
            removeEventListener(sseEvents.LogoAvailabilityChanged, onLogoAvailabilityChanged);
            removeEventListener(sseEvents.ClientsFlushed, onClientsFlushed);
            removeEventListener(sseEvents.ReloadFrontend, onReloadFrontend);
        };
    }, [addEventListener, removeEventListener, queryClient]);

    return null;
}
