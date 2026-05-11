"use client";

import { useTranslations } from "next-intl";
import { type ColorKey } from "shared-utils";
import { InfoTooltip, Input, TextButton } from "shared-components";
import ColorPickerPopup from "./ColorPickerPopup";

interface ColorCardProps {
    colorKey: ColorKey;
    name: string;
    description: string;
    value: string;
    isChanged: boolean;
    isPickerOpen: boolean;
    children?: React.ReactNode;
    onOpenPicker: () => void;
    onClosePicker: () => void;
    onChange: (key: ColorKey, value: string) => void;
    onReset: (key: ColorKey) => void;
    onResetToDefault: (key: ColorKey, name: string) => void;
}

export default function ColorCard({
    colorKey,
    name,
    description,
    value,
    isChanged,
    isPickerOpen,
    children,
    onOpenPicker,
    onClosePicker,
    onChange,
    onReset,
    onResetToDefault,
}: ColorCardProps) {
    const t = useTranslations();

    return (
        <div className="border-gray-1 relative space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
                <label className="text-text-2 block text-xs font-medium">{name}</label>
                <InfoTooltip text={description} size="sm" />
            </div>

            <div
                style={{ backgroundColor: value }}
                className="border-gray-1 h-16 w-full cursor-pointer rounded border"
                onClick={onOpenPicker}
            >
                <div className="flex h-full w-full items-center justify-center">
                    <span className="text-xs text-white mix-blend-difference">
                        {t("clickToEdit")}
                    </span>
                </div>
            </div>

            {isPickerOpen && (
                <ColorPickerPopup
                    value={value}
                    onClose={onClosePicker}
                    onChange={(hex) => onChange(colorKey, hex)}
                />
            )}

            <div className="flex items-center space-x-2">
                <Input
                    value={value}
                    onChange={(e) => onChange(colorKey, e.target.value)}
                    className="flex-1"
                />
                {isChanged && (
                    <TextButton
                        color="blue"
                        className="text-xs whitespace-nowrap"
                        onClick={() => onReset(colorKey)}
                    >
                        {t("reset")}
                    </TextButton>
                )}
            </div>
            <div className="flex justify-end">
                <TextButton
                    color="red"
                    className="text-xs whitespace-nowrap"
                    onClick={() => onResetToDefault(colorKey, name)}
                >
                    {t("reset_to_default")}
                </TextButton>
            </div>

            {children && <div className="space-y-2">{children}</div>}
        </div>
    );
}
