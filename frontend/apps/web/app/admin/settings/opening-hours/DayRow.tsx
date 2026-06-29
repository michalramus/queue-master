"use client";

import { useTranslations } from "next-intl";
import { type OpeningHoursDto, type MultilingualValue, LangCode } from "shared-utils";
import { Checkbox, Input, TextButton } from "shared-components";

export default function DayRow({
    dayData,
    onChange,
    disabled = false,
    labels,
    onLabelsChange,
}: {
    dayData: OpeningHoursDto;
    onChange: (updated: OpeningHoursDto) => void;
    disabled?: boolean;
    labels: MultilingualValue;
    onLabelsChange: (updated: MultilingualValue) => void;
}) {
    const t = useTranslations();
    const { day_of_week: day, is_closed: isClosed = false } = dayData;

    return (
        <div className="rounded border border-gray-200 p-4">
            <div className="flex items-center space-x-4">
                <span className="text-text-1 text-2xl font-medium">
                    {t(`days.${day.toLowerCase()}`)}
                </span>
                <Checkbox
                    label={t("closed")}
                    checked={isClosed}
                    disabled={disabled}
                    onChange={(e) => onChange({ ...dayData, is_closed: e.target.checked })}
                />
                <Input
                    type="time"
                    label={t("open")}
                    value={dayData.open_time ?? ""}
                    disabled={disabled || isClosed}
                    onChange={(e) => onChange({ ...dayData, open_time: e.target.value })}
                />
                <Input
                    type="time"
                    label={t("close")}
                    value={dayData.close_time ?? ""}
                    disabled={disabled || isClosed}
                    onChange={(e) => onChange({ ...dayData, close_time: e.target.value })}
                />
            </div>
            <div className="mt-3 border-t border-gray-100 pt-3">
                <div className="mb-2">
                    <span className="text-text-2 text-sm font-medium">{t("custom_day_label")}</span>
                    <p className="text-text-2 mt-0.5 text-xs">{t("custom_day_label_hint")}</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    {Object.values(LangCode).map((lang) => (
                        <div key={lang} className="flex flex-col gap-1">
                            <Input
                                label={lang.toUpperCase()}
                                value={labels[lang] ?? ""}
                                placeholder={t("enter_label")}
                                disabled={disabled}
                                onChange={(e) =>
                                    onLabelsChange({ ...labels, [lang]: e.target.value || null })
                                }
                            />
                            <TextButton
                                color="red"
                                disabled={disabled || !labels[lang]}
                                onClick={() => onLabelsChange({ ...labels, [lang]: null })} // Clear the label for this language
                            >
                                {t("clear_label")}
                            </TextButton>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
