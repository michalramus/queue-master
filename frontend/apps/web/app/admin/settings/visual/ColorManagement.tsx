"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HuePicker } from "react-color";
import tinycolor from "tinycolor2";
import {
    setGlobalSettings,
    resetGlobalSettings,
    type GlobalSettingsInterface,
    type ColorKey,
    useGlobalSettings,
} from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { Button, ConfirmModal, Spinner, TabNav } from "shared-components";
import { showToast } from "@/utils/toast";
import ColorCardsGrid from "./ColorCardsGrid";
import HslInput from "./HslInput";

type ColorMode = "simple" | "advanced";

const HUE_AFFECTED_COLORS: ColorKey[] = [
    "color_background",
    "color_primary_1",
    "color_primary_2",
    "color_secondary_1",
    "color_secondary_2",
    "color_accent_1",
];

export default function ColorManagement() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    const { data: serverSettings } = useGlobalSettings(axiosPureInstance);

    const [settings, setSettings] = useState<GlobalSettingsInterface | null>(
        serverSettings ?? null,
    );
    const [colorMode, setColorMode] = useState<ColorMode>("simple");
    const [activeColorPicker, setActiveColorPicker] = useState<ColorKey | null>(null);
    const [referenceHue, setReferenceHue] = useState(() =>
        serverSettings ? tinycolor(serverSettings.color_primary_1).toHsl().h : 0,
    );

    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        type?: "danger" | "warning" | "info";
    } | null>(null);

    const saveColorsMutation = useMutation({
        mutationFn: (settingsToSave: GlobalSettingsInterface) =>
            setGlobalSettings(settingsToSave, axiosAuthInstance),
        onSuccess: () => {
            setConfirmConfig(null);
            queryClient.invalidateQueries({ queryKey: ["globalSettings"] });
            //setTimeout(() => window.location.reload(), 1500);
            showToast.success(t("settings_updated_successfully"));
            // showToast.info(t("redirecting"));
        },
        onError: () => {
            showToast.error(t("failed_save_settings"));
        },
    });

    const resetColorsMutation = useMutation({
        mutationFn: (keys: string[]) => resetGlobalSettings(axiosAuthInstance, keys),
        onSuccess: (defaultSettings) => {
            setConfirmConfig(null);
            setSettings(defaultSettings);
            setReferenceHue(tinycolor(defaultSettings.color_primary_1).toHsl().h);
            queryClient.invalidateQueries({ queryKey: ["globalSettings"] });
        },
        onError: () => {
            showToast.error(t("failed_reset_colors"));
        },
    });

    const saving = saveColorsMutation.isPending || resetColorsMutation.isPending;

    function handleColorChange(colorKey: ColorKey, value: string) {
        if (!settings) return;
        setSettings({ ...settings, [colorKey]: value });
    }

    function handleHueChange(newHue: number) {
        if (!settings) return;
        setReferenceHue(newHue);

        //Iterate over all colors affected by hue change and update their hue while keeping saturation and lightness
        const hueUpdates = HUE_AFFECTED_COLORS.reduce<Partial<GlobalSettingsInterface>>(
            (acc, key) => {
                const currentColor = settings[key];
                if (typeof currentColor !== "string" || !currentColor.startsWith("#")) return acc;
                const { s, l } = tinycolor(currentColor).toHsl();
                return { ...acc, [key]: tinycolor({ h: newHue, s, l }).toHexString() };
            },
            {},
        );
        setSettings({ ...settings, ...hueUpdates });
    }

    function handleUndo() {
        if (!serverSettings) return;
        setSettings(serverSettings);
        setReferenceHue(tinycolor(serverSettings.color_primary_1).toHsl().h);
        showToast.info(t("colors_restored_from_database"));
    }

    function handleResetToDefaults() {
        setConfirmConfig({
            isOpen: true,
            title: t("reset_to_defaults"),
            message: t("confirm_reset_all_colors"),
            type: "danger",
            onConfirm: () => {
                const keys = Object.keys(settings || {}).filter((key) => key.startsWith("color_"));
                resetColorsMutation.mutate(keys, {
                    onSuccess: () => showToast.success(t("colors_reset_to_defaults")),
                });
            },
        });
    }

    function handleResetColor(colorKey: ColorKey) {
        if (!settings || !serverSettings) return;
        setSettings({ ...settings, [colorKey]: serverSettings[colorKey] });
        showToast.info(t("color_reset_to_original"));
    }

    function handleResetColorToDefault(colorKey: ColorKey, colorName: string) {
        setConfirmConfig({
            isOpen: true,
            title: t("reset_to_default_named", { name: colorName }),
            message: t("confirm_reset_color"),
            type: "danger",
            onConfirm: () => {
                resetColorsMutation.mutate([colorKey], {
                    onSuccess: () =>
                        showToast.success(t("color_reset_to_default_named", { name: colorName })),
                });
            },
        });
    }

    function isColorChanged(colorKey: ColorKey): boolean {
        if (!settings || !serverSettings) return false;
        return settings[colorKey] !== serverSettings[colorKey];
    }

    if (!settings) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size="lg" label={t("loading")} />
            </div>
        );
    }

    const colorModeTabs: { key: ColorMode; label: string }[] = [
        { key: "simple", label: t("simple_mode") },
        { key: "advanced", label: t("advanced_mode") },
    ];

    return (
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-text-1 text-xl font-bold">{t("color_management")}</h2>
                <div className="flex items-center gap-2">
                    <Button color="gray" onClick={handleUndo} disabled={saving}>
                        {t("undo")}
                    </Button>
                    <Button color="red" onClick={handleResetToDefaults} disabled={saving}>
                        {saving ? t("resetting") : t("reset_to_defaults")}
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => saveColorsMutation.mutate(settings)}
                        disabled={saving}
                        className="flex items-center disabled:opacity-50"
                    >
                        {saving && <Spinner size="sm" className="mr-2 text-white" />}
                        {saving ? t("saving") : t("save_color_settings")}
                    </Button>
                </div>
            </div>

            <TabNav
                tabs={colorModeTabs}
                activeTab={colorMode}
                onChange={setColorMode}
                className="mb-6"
            />

            {colorMode === "simple" ? (
                <>
                    <div className="mb-6">
                        <label className="text-text-2 mb-2 block text-sm font-medium">
                            {t("hue_applies_to_all")}
                        </label>
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <HuePicker
                                    color={{ h: referenceHue, s: 100, l: 50 }}
                                    onChange={(color) => handleHueChange(color.hsl.h)}
                                    width="100%"
                                />
                            </div>
                            <div className="w-16">
                                <HslInput
                                    label="h"
                                    numericValue={Math.round(referenceHue)}
                                    max={360}
                                    onCommit={handleHueChange}
                                />
                            </div>
                        </div>
                        <p className="text-gray-2 mt-2 text-xs">
                            {t("hue_mode_description")} {t("rgb_colors_protected")}
                        </p>
                    </div>

                    <div className="border-gray-1 mt-6 rounded-lg border p-6">
                        <h3 className="text-text-2 mb-4 text-sm font-medium">
                            {t("live_preview")}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                style={{
                                    backgroundColor: settings.color_primary_1,
                                    color: settings.color_text_1,
                                }}
                                className="!m-0 flex-col"
                            >
                                <span>{t("button")}</span> <br />
                                <span
                                    style={{ color: settings.color_text_2 }}
                                    className="text-xs font-normal"
                                >
                                    {t("button_description")}
                                </span>
                            </Button>
                            <Button
                                style={{
                                    backgroundColor: settings.color_secondary_1,
                                    color: settings.color_text_1,
                                }}
                                className="!m-0 flex-col"
                            >
                                <span>{t("button")}</span> <br />
                                <span
                                    style={{ color: settings.color_text_2 }}
                                    className="text-xs font-normal"
                                >
                                    {t("button_description")}
                                </span>
                            </Button>
                            <Button
                                style={{
                                    backgroundColor: settings.color_background,
                                    borderColor: settings.color_accent_1,
                                    color: settings.color_text_1,
                                }}
                                className="!m-0 flex-col border-2"
                            >
                                <span>{t("button")}</span> <br />
                                <span
                                    style={{ color: settings.color_text_2 }}
                                    className="text-xs font-normal"
                                >
                                    {t("button_description")}
                                </span>
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                <ColorCardsGrid
                    settings={settings}
                    isColorChanged={isColorChanged}
                    activeColorPicker={activeColorPicker}
                    onOpenPicker={setActiveColorPicker}
                    onClosePicker={() => setActiveColorPicker(null)}
                    onChange={handleColorChange}
                    onReset={handleResetColor}
                    onResetToDefault={handleResetColorToDefault}
                />
            )}

            {confirmConfig && (
                <ConfirmModal
                    isOpen={confirmConfig.isOpen}
                    title={confirmConfig.title}
                    message={confirmConfig.message}
                    confirmText={t("confirm")}
                    cancelText={t("cancel")}
                    onConfirm={confirmConfig.onConfirm}
                    onCancel={() => setConfirmConfig(null)}
                    type={confirmConfig.type}
                />
            )}
        </div>
    );
}
