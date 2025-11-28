"use client";

import { useGlobalSettings, GlobalSettingsInterface } from "shared-utils";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";

/**
 * Client component that dynamically applies global color CSS variables
 * Updates automatically when globalSettings query is invalidated
 */
export default function GlobalStylesProvider({
    initialData,
}: {
    initialData?: GlobalSettingsInterface;
}) {
    const { data: globalSettings } = useGlobalSettings(axiosPureInstance, {
        initialData,
    });

    if (!globalSettings) return null;

    return (
        <style>{`:root { 
            ${globalSettings.color_background ? `--color-background: ${globalSettings.color_background} !important;` : ""}
            ${globalSettings.color_primary_1 ? `--color-primary-1: ${globalSettings.color_primary_1} !important;` : ""}
            ${globalSettings.color_primary_2 ? `--color-primary-2: ${globalSettings.color_primary_2} !important;` : ""}
            ${globalSettings.color_secondary_1 ? `--color-secondary-1: ${globalSettings.color_secondary_1} !important;` : ""}
            ${globalSettings.color_secondary_2 ? `--color-secondary-2: ${globalSettings.color_secondary_2} !important;` : ""}
            ${globalSettings.color_accent_1 ? `--color-accent-1: ${globalSettings.color_accent_1} !important;` : ""}
            ${globalSettings.color_green_1 ? `--color-green-1: ${globalSettings.color_green_1} !important;` : ""}
            ${globalSettings.color_green_2 ? `--color-green-2: ${globalSettings.color_green_2} !important;` : ""}
            ${globalSettings.color_blue_1 ? `--color-blue-1: ${globalSettings.color_blue_1} !important;` : ""}
            ${globalSettings.color_blue_2 ? `--color-blue-2: ${globalSettings.color_blue_2} !important;` : ""}
            ${globalSettings.color_red_1 ? `--color-red-1: ${globalSettings.color_red_1} !important;` : ""}
            ${globalSettings.color_red_2 ? `--color-red-2: ${globalSettings.color_red_2} !important;` : ""}
            ${globalSettings.color_gray_1 ? `--color-gray-1: ${globalSettings.color_gray_1} !important;` : ""}
            ${globalSettings.color_gray_2 ? `--color-gray-2: ${globalSettings.color_gray_2} !important;` : ""}
            ${globalSettings.color_text_1 ? `--color-text-1: ${globalSettings.color_text_1} !important;` : ""}
            ${globalSettings.color_text_2 ? `--color-text-2: ${globalSettings.color_text_2} !important;` : ""}
        }`}</style>
    );
}
