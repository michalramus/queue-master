"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-textarea-code-editor/dist.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
    ssr: false,
    loading: () => (
        <div className="flex h-[400px] items-center justify-center rounded border border-gray-200">
            <Spinner size="md" />
        </div>
    ),
});
const CodeEditor = dynamic(() => import("@uiw/react-textarea-code-editor"), {
    ssr: false,
    loading: () => (
        <div className="flex min-h-[150px] items-center justify-center rounded border border-gray-200">
            <Spinner size="md" />
        </div>
    ),
});

import {
    LangCode,
    setGlobalSettings,
    setMultilingualSettings,
    type GlobalSettingsInterface,
    type MultilingualSettingsInterface,
    useGlobalSettings,
    useMultilingualSettings,
} from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { Button, Checkbox, SanitizedHtml, Select, Spinner } from "shared-components";
import { showToast } from "@/utils/toast";

export default function OtherSettingsClient() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    const { data: serverGlobalSettings } = useGlobalSettings(axiosPureInstance);
    const { data: serverMultilingualSettings } = useMultilingualSettings(axiosPureInstance);

    const [globalSettings, setGlobalSettingsState] = useState<GlobalSettingsInterface>(
        serverGlobalSettings!,
    );
    const [multilingualSettings, setMultilingualSettingsState] =
        useState<MultilingualSettingsInterface>(serverMultilingualSettings!);

    const hasKioskMarkdownChanges = useMemo(() => {
        if (!serverGlobalSettings) return false;
        return globalSettings.kiosk_markdown !== serverGlobalSettings.kiosk_markdown;
    }, [globalSettings, serverGlobalSettings]);

    const hasPrintingChanges = useMemo(() => {
        if (!serverMultilingualSettings) return false;
        const current = multilingualSettings.printing_ticket_template;
        const original = serverMultilingualSettings.printing_ticket_template;
        return current?.en !== original?.en || current?.pl !== original?.pl;
    }, [multilingualSettings, serverMultilingualSettings]);

    const renderPreview = (template: string, lang: string) => {
        const sampleData = {
            categoryShortName: "A",
            number: "123",
            date: new Date().toLocaleDateString(lang === "pl" ? "pl-PL" : "en-US"),
            time: new Date().toLocaleTimeString(lang === "pl" ? "pl-PL" : "en-US", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        return template
            .replace(/&categoryShortName/g, sampleData.categoryShortName)
            .replace(/&number/g, sampleData.number)
            .replace(/&date/g, sampleData.date)
            .replace(/&time/g, sampleData.time);
    };

    const saveMutation = useMutation({
        mutationFn: async () => {
            await Promise.all([
                setGlobalSettings(globalSettings, axiosAuthInstance),
                setMultilingualSettings(multilingualSettings, axiosAuthInstance),
            ]);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["globalSettings"] });
            queryClient.invalidateQueries({ queryKey: ["multilingualSettings"] });
            showToast.success(t("settings_updated_successfully"));
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            showToast.error(err.response?.data?.message || t("failed_save_settings"));
        },
    });

    const handleGlobalSettingChange = (key: string, value: string | boolean) => {
        setGlobalSettingsState({ ...globalSettings, [key]: value });
    };

    const handleMultilingualChange = (key: string, lang: string, value: string) => {
        setMultilingualSettingsState({
            ...multilingualSettings,
            [key]: {
                ...(multilingualSettings[key as keyof MultilingualSettingsInterface] || {}),
                [lang]: value,
            },
        });
    };

    const handleUndoKiosk = () => {
        if (serverGlobalSettings) {
            setGlobalSettingsState({
                ...globalSettings,
                kiosk_markdown: serverGlobalSettings.kiosk_markdown,
            });
            showToast.info(t("kiosk_restored_from_database"));
        }
    };

    const handleUndoPrinting = () => {
        if (serverMultilingualSettings) {
            setMultilingualSettingsState({
                ...multilingualSettings,
                printing_ticket_template: serverMultilingualSettings.printing_ticket_template,
            });
            showToast.info(t("printing_template_restored_from_database"));
        }
    };

    const allLangs = Object.values(LangCode);
    const orderedLangs = [
        globalSettings.locale as LangCode,
        ...allLangs.filter((l) => l !== globalSettings.locale),
    ];

    return (
        <div>
            {/* Locale Settings */}
            <div className="mb-6 rounded-lg bg-white p-6 shadow">
                <h2 className="text-text-1 mb-4 text-xl font-bold">
                    {t("language_and_localization")}
                </h2>
                <div className="space-y-4">
                    <Select<string>
                        label={t("default_locale")}
                        value={globalSettings.locale}
                        onChange={(value) => handleGlobalSettingChange("locale", value)}
                        hint={t("default_locale_description")}
                        className="max-w-md"
                    >
                        <option value="en">{t("english")}</option>
                        <option value="pl">{t("polish")}</option>
                    </Select>
                    <Checkbox
                        id="tv_auto_switch_language"
                        label={t("tv_auto_switch_language")}
                        checked={globalSettings.tv_auto_switch_language}
                        onChange={(e) =>
                            handleGlobalSettingChange("tv_auto_switch_language", e.target.checked)
                        }
                        hint={t("auto_switch_language_description")}
                    />
                </div>
            </div>

            {/* Kiosk Settings */}
            <div className="mb-6 rounded-lg bg-white p-6 shadow">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-text-1 text-xl font-bold">{t("kiosk_settings")}</h2>
                    {hasKioskMarkdownChanges && (
                        <Button color="gray" onClick={handleUndoKiosk}>
                            {t("undo")}
                        </Button>
                    )}
                </div>
                <div>
                    <label className="text-text-1 mb-2 block text-sm font-medium">
                        {t("text_shown_on_kiosk")}
                    </label>
                    <div data-color-mode="light">
                        <MDEditor
                            value={globalSettings.kiosk_markdown || ""}
                            onChange={(value) =>
                                handleGlobalSettingChange("kiosk_markdown", value || "")
                            }
                            height={400}
                        />
                    </div>
                </div>
            </div>

            {/* Printing Settings */}
            <div className="mb-6 rounded-lg bg-white p-6 shadow">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-text-1 text-xl font-bold">{t("printing_template")}</h2>
                    {hasPrintingChanges && (
                        <Button color="gray" onClick={handleUndoPrinting}>
                            {t("undo")}
                        </Button>
                    )}
                </div>
                <p className="text-text-2 mb-1 text-sm">
                    {t("printing_template_description")}{" "}
                    <strong>{t("printing_template_html_label")}</strong>.{" "}
                    {t("printing_template_placeholders_intro")}:
                </p>
                <ol className="text-text-2 mb-4 list-decimal pl-5 text-xs">
                    <li>
                        <strong>
                            <u>
                                <code>&amp;categoryShortName</code>
                            </u>
                        </strong>{" "}
                        — {t("placeholder_category_short_name_desc")} — {t("example")}:{" "}
                        <em>{t("placeholder_category_short_name_example")}</em>
                    </li>
                    <li>
                        <strong>
                            <u>
                                <code>&amp;number</code>
                            </u>
                        </strong>{" "}
                        — {t("placeholder_number_desc")} — {t("example")}:{" "}
                        <em>{t("placeholder_number_example")}</em>
                    </li>
                    <li>
                        <strong>
                            <u>
                                <code>&amp;date</code>
                            </u>
                        </strong>{" "}
                        — {t("placeholder_date_desc")} — {t("example")}:{" "}
                        <em>{t("placeholder_date_example")}</em>
                    </li>
                    <li>
                        <strong>
                            <u>
                                <code>&amp;time</code>
                            </u>
                        </strong>{" "}
                        — {t("placeholder_time_desc")} — {t("example")}:{" "}
                        <em>{t("placeholder_time_example")}</em>
                    </li>
                </ol>
                <div className="space-y-4">
                    {orderedLangs.map((lang) => (
                        <div key={lang}>
                            <label className="text-text-1 mb-2 block text-sm font-medium">
                                {lang === LangCode.pl
                                    ? t("polish_template")
                                    : t("english_template")}
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div data-color-mode="light">
                                    <CodeEditor
                                        value={
                                            multilingualSettings.printing_ticket_template?.[lang] ||
                                            ""
                                        }
                                        language="html"
                                        onChange={(e) =>
                                            handleMultilingualChange(
                                                "printing_ticket_template",
                                                lang,
                                                e.target.value,
                                            )
                                        }
                                        placeholder={t("printing_template_placeholder")}
                                        minHeight={150}
                                        className="border-gray-1 rounded border font-mono text-sm"
                                        style={{ backgroundColor: "#fff" }}
                                    />
                                </div>
                                <div className="border-gray-1 rounded border bg-white p-3">
                                    <p className="text-text-2 mb-2 text-xs font-semibold">
                                        {t("preview")}:
                                    </p>
                                    <SanitizedHtml
                                        className="text-sm"
                                        html={renderPreview(
                                            multilingualSettings.printing_ticket_template?.[lang] ||
                                                "",
                                            lang,
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    color="primary"
                    onClick={() => saveMutation.mutate()}
                    disabled={saveMutation.isPending}
                    className="flex items-center disabled:opacity-50"
                >
                    {saveMutation.isPending && <Spinner size="sm" className="mr-2 text-white" />}
                    {saveMutation.isPending ? t("saving") : t("save_all_settings")}
                </Button>
            </div>
        </div>
    );
}
