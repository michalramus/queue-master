"use client";

import { useTranslations } from "next-intl";
import { type OpeningHoursDto } from "shared-utils";
import { Checkbox, Input } from "shared-components";

export default function DayRow({
    dayData,
    onChange,
    disabled = false,
}: {
    dayData: OpeningHoursDto;
    onChange: (updated: OpeningHoursDto) => void;
    disabled?: boolean;
}) {
    const t = useTranslations();
    const { day_of_week: day, is_closed: isClosed = false } = dayData;

    return (
        <div className="flex items-center space-x-4 rounded border border-gray-200 p-4">
            <span className="text-text-1 w-32 font-medium">{t(`days.${day.toLowerCase()}`)}</span>
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
    );
}
