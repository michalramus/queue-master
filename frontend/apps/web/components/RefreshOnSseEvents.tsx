"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { sseEvents } from "shared-utils";
import { useSse } from "@/utils/hooks/useSse";

/**
 * Listen to SSE events and invalidate appropriate queries
 * @returns null
 */
export default function RefreshOnSseEvents() {
    const router = useRouter();
    const { addEventListener, removeEventListener } = useSse();
    const queryClient = useQueryClient();

    useEffect(() => {
        function onGlobalSettingsChanged() {
            queryClient.invalidateQueries({ queryKey: ["globalSettings"] });
        }

        function onCategoriesChanged() {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        }

        function onOpeningHoursChanged() {
            queryClient.invalidateQueries({ queryKey: ["openingHours"] });
            // Also refresh Next.js cache for server components
            router.refresh();
        }

        function onLogoAvailabilityChanged() {
            queryClient.invalidateQueries({ queryKey: ["logoAvailabilities"] });
        }

        function onUserSettingsChanged() {
            queryClient.invalidateQueries({ queryKey: ["userSettings"] });
            // Refresh Next.js cache for server components that depend on user settings
            router.refresh();
        }

        function onClientsFlushed() {
            queryClient.invalidateQueries({ queryKey: ["waitingClients"] });
            queryClient.invalidateQueries({ queryKey: ["inServiceClients"] });
        }

        function onReloadFrontend() {
            router.refresh();
        }

        addEventListener(sseEvents.GlobalSettingsChanged, onGlobalSettingsChanged);
        addEventListener(sseEvents.CategoriesChanged, onCategoriesChanged);
        addEventListener(sseEvents.OpeningHoursChanged, onOpeningHoursChanged);
        addEventListener(sseEvents.LogoAvailabilityChanged, onLogoAvailabilityChanged);
        addEventListener(sseEvents.UserSettingsChanged, onUserSettingsChanged);
        addEventListener(sseEvents.ClientsFlushed, onClientsFlushed);
        addEventListener(sseEvents.ReloadFrontend, onReloadFrontend);

        return () => {
            removeEventListener(sseEvents.GlobalSettingsChanged, onGlobalSettingsChanged);
            removeEventListener(sseEvents.CategoriesChanged, onCategoriesChanged);
            removeEventListener(sseEvents.OpeningHoursChanged, onOpeningHoursChanged);
            removeEventListener(sseEvents.LogoAvailabilityChanged, onLogoAvailabilityChanged);
            removeEventListener(sseEvents.UserSettingsChanged, onUserSettingsChanged);
            removeEventListener(sseEvents.ClientsFlushed, onClientsFlushed);
            removeEventListener(sseEvents.ReloadFrontend, onReloadFrontend);
        };
    }, [router, addEventListener, removeEventListener, queryClient]);

    return null;
}
