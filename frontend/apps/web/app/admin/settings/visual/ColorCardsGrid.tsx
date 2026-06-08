"use client";

import { useTranslations } from "next-intl";
import { type GlobalSettingsInterface, type ColorKey } from "shared-utils";
import { Button } from "shared-components";
import ColorCard from "./ColorCard";

interface ColorCardsGridProps {
    settings: GlobalSettingsInterface;
    isColorChanged: (key: ColorKey) => boolean;
    activeColorPicker: ColorKey | null;
    onOpenPicker: (key: ColorKey) => void;
    onClosePicker: () => void;
    onChange: (key: ColorKey, value: string) => void;
    onReset: (key: ColorKey) => void;
    onResetToDefault: (key: ColorKey, name: string) => void;
}

export default function ColorCardsGrid({
    settings,
    isColorChanged,
    activeColorPicker,
    onOpenPicker,
    onClosePicker,
    onChange,
    onReset,
    onResetToDefault,
}: ColorCardsGridProps) {
    const t = useTranslations();

    const cards: Array<{
        key: ColorKey;
        nameKey: string;
        descriptionKey: string;
        preview: React.ReactNode;
    }> = [
        {
            key: "color_background",
            nameKey: "color_name_background",
            descriptionKey: "color_description_background",
            preview: (
                <div
                    style={{ backgroundColor: settings.color_background }}
                    className="rounded p-2 text-center"
                >
                    <p
                        style={{ color: settings.color_text_1 }}
                        className="mb-0.5 text-sm font-medium"
                    >
                        {t("preview_title")}
                    </p>
                    <p style={{ color: settings.color_text_2 }} className="text-sm">
                        {t("preview_description")}
                    </p>
                </div>
            ),
        },
        {
            key: "color_primary_1",
            nameKey: "color_name_primary_1",
            descriptionKey: "color_description_primary_1",
            preview: (
                <Button
                    style={{
                        backgroundColor: settings.color_primary_1,
                        color: settings.color_text_1,
                    }}
                    className="!m-0 flex w-full flex-col"
                >
                    <span>{t("button")}</span>
                    <span style={{ color: settings.color_text_2 }} className="text-xs font-normal">
                        {t("button_description")}
                    </span>
                </Button>
            ),
        },
        {
            key: "color_primary_2",
            nameKey: "color_name_primary_2",
            descriptionKey: "color_description_primary_2",
            preview: (
                <Button
                    style={{
                        backgroundColor: settings.color_primary_2,
                        color: settings.color_text_1,
                    }}
                    className="!m-0 flex w-full flex-col"
                >
                    <span>{t("button_clicked")}</span>
                    <span style={{ color: settings.color_text_2 }} className="text-xs font-normal">
                        {t("button_description")}
                    </span>
                </Button>
            ),
        },
        {
            key: "color_secondary_1",
            nameKey: "color_name_secondary_1",
            descriptionKey: "color_description_secondary_1",
            preview: (
                <Button
                    style={{
                        backgroundColor: settings.color_secondary_1,
                        color: settings.color_text_1,
                    }}
                    className="!m-0 flex w-full flex-col"
                >
                    <span>{t("button")}</span>
                    <span style={{ color: settings.color_text_2 }} className="text-xs font-normal">
                        {t("button_description")}
                    </span>
                </Button>
            ),
        },
        {
            key: "color_secondary_2",
            nameKey: "color_name_secondary_2",
            descriptionKey: "color_description_secondary_2",
            preview: (
                <Button
                    style={{
                        backgroundColor: settings.color_secondary_2,
                        color: settings.color_text_1,
                    }}
                    className="!m-0 flex w-full flex-col"
                >
                    <span>{t("button_clicked")}</span>
                    <span style={{ color: settings.color_text_2 }} className="text-xs font-normal">
                        {t("button_description")}
                    </span>
                </Button>
            ),
        },
        {
            key: "color_accent_1",
            nameKey: "color_name_accent_1",
            descriptionKey: "color_description_accent_1",
            preview: (
                <Button
                    style={{
                        backgroundColor: settings.color_background,
                        borderColor: settings.color_accent_1,
                        color: settings.color_text_1,
                    }}
                    className="!m-0 w-full flex-col border-2"
                >
                    <span>{t("button")}</span> <br />
                    <span style={{ color: settings.color_text_2 }} className="text-xs font-normal">
                        {t("button_description")}
                    </span>
                </Button>
            ),
        },
        {
            key: "color_green_1",
            nameKey: "color_name_green_1",
            descriptionKey: "color_description_green_1",
            preview: (
                <Button
                    style={{
                        backgroundColor: settings.color_green_1,
                        color: settings.color_text_1,
                    }}
                    className="!m-0 flex w-full flex-col"
                >
                    <span>{t("button")}</span>
                    <span style={{ color: settings.color_text_2 }} className="text-xs font-normal">
                        {t("button_description")}
                    </span>
                </Button>
            ),
        },
        {
            key: "color_green_2",
            nameKey: "color_name_green_2",
            descriptionKey: "color_description_green_2",
            preview: (
                <Button
                    style={{
                        backgroundColor: settings.color_green_2,
                        color: settings.color_text_1,
                    }}
                    className="!m-0 flex w-full flex-col"
                >
                    <span>{t("button_clicked")}</span>
                    <span style={{ color: settings.color_text_2 }} className="text-xs font-normal">
                        {t("button_description")}
                    </span>
                </Button>
            ),
        },
        {
            key: "color_blue_1",
            nameKey: "color_name_blue_1",
            descriptionKey: "color_description_blue_1",
            preview: (
                <Button
                    style={{ backgroundColor: settings.color_blue_1, color: settings.color_text_1 }}
                    className="!m-0 flex w-full flex-col"
                >
                    <span>{t("button")}</span>
                    <span style={{ color: settings.color_text_2 }} className="text-xs font-normal">
                        {t("button_description")}
                    </span>
                </Button>
            ),
        },
        {
            key: "color_blue_2",
            nameKey: "color_name_blue_2",
            descriptionKey: "color_description_blue_2",
            preview: (
                <Button
                    style={{ backgroundColor: settings.color_blue_2, color: settings.color_text_1 }}
                    className="!m-0 flex w-full flex-col"
                >
                    <span>{t("button_clicked")}</span>
                    <span style={{ color: settings.color_text_2 }} className="text-xs font-normal">
                        {t("button_description")}
                    </span>
                </Button>
            ),
        },
        {
            key: "color_red_1",
            nameKey: "color_name_red_1",
            descriptionKey: "color_description_red_1",
            preview: (
                <Button
                    style={{ backgroundColor: settings.color_red_1, color: settings.color_text_1 }}
                    className="!m-0 flex w-full flex-col"
                >
                    <span>{t("button")}</span>
                    <span style={{ color: settings.color_text_2 }} className="text-xs font-normal">
                        {t("button_description")}
                    </span>
                </Button>
            ),
        },
        {
            key: "color_red_2",
            nameKey: "color_name_red_2",
            descriptionKey: "color_description_red_2",
            preview: (
                <Button
                    style={{ backgroundColor: settings.color_red_2, color: settings.color_text_1 }}
                    className="!m-0 flex w-full flex-col"
                >
                    <span>{t("button_clicked")}</span>
                    <span style={{ color: settings.color_text_2 }} className="text-xs font-normal">
                        {t("button_description")}
                    </span>
                </Button>
            ),
        },
        {
            key: "color_gray_1",
            nameKey: "color_name_gray_1",
            descriptionKey: "color_description_gray_1",
            preview: (
                <Button
                    style={{ backgroundColor: settings.color_gray_1, color: settings.color_text_1 }}
                    className="!m-0 flex w-full flex-col"
                >
                    <span>{t("button")}</span>
                    <span style={{ color: settings.color_text_2 }} className="text-xs font-normal">
                        {t("button_description")}
                    </span>
                </Button>
            ),
        },
        {
            key: "color_gray_2",
            nameKey: "color_name_gray_2",
            descriptionKey: "color_description_gray_2",
            preview: (
                <Button
                    style={{ backgroundColor: settings.color_gray_2, color: settings.color_text_1 }}
                    className="!m-0 flex w-full flex-col"
                >
                    <span>{t("button_clicked")}</span>
                    <span style={{ color: settings.color_text_2 }} className="text-xs font-normal">
                        {t("button_description")}
                    </span>
                </Button>
            ),
        },
        {
            key: "color_yellow_1",
            nameKey: "color_name_yellow_1",
            descriptionKey: "color_description_yellow_1",
            preview: (
                <Button
                    style={{
                        backgroundColor: settings.color_yellow_1,
                        color: settings.color_text_1,
                    }}
                    className="!m-0 flex w-full flex-col"
                >
                    <span>{t("button")}</span>
                    <span style={{ color: settings.color_text_2 }} className="text-xs font-normal">
                        {t("button_description")}
                    </span>
                </Button>
            ),
        },
        {
            key: "color_yellow_2",
            nameKey: "color_name_yellow_2",
            descriptionKey: "color_description_yellow_2",
            preview: (
                <Button
                    style={{
                        backgroundColor: settings.color_yellow_2,
                        color: settings.color_text_1,
                    }}
                    className="!m-0 flex w-full flex-col"
                >
                    <span>{t("button_clicked")}</span>
                    <span style={{ color: settings.color_text_2 }} className="text-xs font-normal">
                        {t("button_description")}
                    </span>
                </Button>
            ),
        },
        {
            key: "color_text_1",
            nameKey: "color_name_text_1",
            descriptionKey: "color_description_text_1",
            preview: (
                <div
                    style={{ backgroundColor: settings.color_background }}
                    className="rounded p-2 text-center"
                >
                    <p style={{ color: settings.color_text_1 }} className="text-md font-medium">
                        {t("preview_title")}
                    </p>
                </div>
            ),
        },
        {
            key: "color_text_2",
            nameKey: "color_name_text_2",
            descriptionKey: "color_description_text_2",
            preview: (
                <div
                    style={{ backgroundColor: settings.color_background }}
                    className="rounded p-2 text-center"
                >
                    <p style={{ color: settings.color_text_2 }} className="text-md">
                        {t("preview_description")}
                    </p>
                </div>
            ),
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cards.map(({ key, nameKey, descriptionKey, preview }) => (
                <ColorCard
                    key={key}
                    colorKey={key}
                    name={t(nameKey)}
                    description={t(descriptionKey)}
                    value={settings[key].toString()}
                    isChanged={isColorChanged(key)}
                    isPickerOpen={activeColorPicker === key}
                    onOpenPicker={() => onOpenPicker(key)}
                    onClosePicker={onClosePicker}
                    onChange={onChange}
                    onReset={onReset}
                    onResetToDefault={onResetToDefault}
                >
                    {preview}
                </ColorCard>
            ))}
        </div>
    );
}
