"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
    setOpeningHours,
    type OpeningHoursDto,
    type GlobalSettingsInterface,
    type MultilingualSettingsInterface,
    type MultilingualValue,
    DayOfWeek,
    LangCode,
    setGlobalSettings,
    setMultilingualSettings,
    useOpeningHours,
    useGlobalSettings,
    useMultilingualSettings,
} from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { Button, Checkbox, Select, Spinner } from "shared-components";
import { showToast } from "@/utils/toast";
import { PageHeader } from "@/components/admin";
import DayRow from "./DayRow";

type OverrideOption = GlobalSettingsInterface["opening_hours_override"];
type AllDayLabels = { [day in DayOfWeek]: MultilingualValue };

const daysOfWeek = Object.values(DayOfWeek);

function defaultDayData(day: DayOfWeek): OpeningHoursDto {
    return { day_of_week: day, is_closed: false, open_time: "09:00", close_time: "17:00" };
}

function labelsFromMultilingual(settings: MultilingualSettingsInterface | undefined): AllDayLabels {
    const empty: MultilingualValue = {};
    return {
        [DayOfWeek.MONDAY]: settings?.monday_label ?? empty,
        [DayOfWeek.TUESDAY]: settings?.tuesday_label ?? empty,
        [DayOfWeek.WEDNESDAY]: settings?.wednesday_label ?? empty,
        [DayOfWeek.THURSDAY]: settings?.thursday_label ?? empty,
        [DayOfWeek.FRIDAY]: settings?.friday_label ?? empty,
        [DayOfWeek.SATURDAY]: settings?.saturday_label ?? empty,
        [DayOfWeek.SUNDAY]: settings?.sunday_label ?? empty,
    };
}

function labelsToMultilingual(labels: AllDayLabels): MultilingualSettingsInterface {
    return {
        monday_label: labels[DayOfWeek.MONDAY],
        tuesday_label: labels[DayOfWeek.TUESDAY],
        wednesday_label: labels[DayOfWeek.WEDNESDAY],
        thursday_label: labels[DayOfWeek.THURSDAY],
        friday_label: labels[DayOfWeek.FRIDAY],
        saturday_label: labels[DayOfWeek.SATURDAY],
        sunday_label: labels[DayOfWeek.SUNDAY],
    };
}

export default function OpeningHoursClient() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    const { data: serverHours } = useOpeningHours(axiosAuthInstance);
    const { data: serverGlobalSettings } = useGlobalSettings(axiosPureInstance);
    const { data: serverMultilingualSettings } = useMultilingualSettings(axiosPureInstance);

    const [openingHours, setOpeningHoursState] = useState<OpeningHoursDto[]>(serverHours ?? []);
    const [enabled, setEnabled] = useState(serverGlobalSettings?.enable_opening_hours ?? false);
    const [override, setOverride] = useState<OverrideOption>(
        serverGlobalSettings?.opening_hours_override ?? "off",
    );
    const [dayLabels, setDayLabels] = useState<AllDayLabels>(
        labelsFromMultilingual(serverMultilingualSettings),
    );
    const hasChanges = (() => {
        if (!serverHours || !serverGlobalSettings || !serverMultilingualSettings) return false;
        if (
            enabled !== serverGlobalSettings.enable_opening_hours ||
            override !== serverGlobalSettings.opening_hours_override
        )
            return true;
        if (openingHours.length !== serverHours.length) return true;
        if (
            openingHours.some((hour, idx) => {
                const original = serverHours[idx];
                if (!original) return true;
                return (
                    hour.day_of_week !== original.day_of_week ||
                    hour.is_closed !== original.is_closed ||
                    hour.open_time !== original.open_time ||
                    hour.close_time !== original.close_time
                );
            })
        )
            return true;
        const serverLabels = labelsFromMultilingual(serverMultilingualSettings);
        return daysOfWeek.some((day) =>
            Object.values(LangCode).some(
                (lang) => (dayLabels[day][lang] ?? null) !== (serverLabels[day][lang] ?? null),
            ),
        );
    })();

    const saveMutation = useMutation({
        mutationFn: async () => {
            if (!serverGlobalSettings) throw new Error("Settings not loaded");

            const sanitizedHours = openingHours.map((hour) => ({
                ...hour,
                open_time: hour.is_closed ? (hour.open_time ?? null) : (hour.open_time ?? "09:00"),
                close_time: hour.is_closed
                    ? (hour.close_time ?? null)
                    : (hour.close_time ?? "17:00"),
            }));

            await setOpeningHours({ opening_hours: sanitizedHours }, axiosAuthInstance);
            await setGlobalSettings(
                { enable_opening_hours: enabled, opening_hours_override: override },
                axiosAuthInstance,
            );
            await setMultilingualSettings(labelsToMultilingual(dayLabels), axiosAuthInstance);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["openingHours"] });
            queryClient.invalidateQueries({ queryKey: ["globalSettings"] });
            queryClient.invalidateQueries({ queryKey: ["multilingualSettings"] });
            showToast.success(t("opening_hours_saved"));
        },
        onError: (error: unknown) => {
            const message = isAxiosError(error) ? error.response?.data?.message : undefined;
            showToast.error(message ?? t("failed_save_settings"));
        },
    });

    function handleDayChange(updated: OpeningHoursDto) {
        const next = [...openingHours];
        next[openingHours.findIndex((h) => h.day_of_week === updated.day_of_week)] = updated;
        setOpeningHoursState(next);
    }

    function handleUndo() {
        if (serverHours) setOpeningHoursState(serverHours);
        if (serverGlobalSettings) {
            setEnabled(serverGlobalSettings.enable_opening_hours);
            setOverride(serverGlobalSettings.opening_hours_override);
        }
        if (serverMultilingualSettings) {
            setDayLabels(labelsFromMultilingual(serverMultilingualSettings));
        }
        showToast.info(t("schedule_restored_from_database"));
    }

    return (
        <div>
            <PageHeader title={t("opening_hours_settings")} />

            <div className="mb-6 rounded-lg bg-white p-6 shadow">
                <p className="text-text-1 mb-4 text-xl font-bold">{t("global_settings")}</p>
                <div className="space-y-4">
                    <Checkbox
                        id="enable_opening_hours"
                        label={t("enable_opening_hours")}
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                    />
                    <Select
                        label={t("override_mode")}
                        hint={t("override_description")}
                        value={override}
                        onChange={(value) => setOverride(value)}
                    >
                        <option value="off">{t("off_use_schedule")}</option>
                        <option value="override_to_open">{t("force_open_description")}</option>
                        <option value="override_to_close">{t("force_closed_description")}</option>
                    </Select>
                </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
                <p className="text-text-1 mb-4 text-xl font-bold">{t("weekly_schedule")}</p>
                <div className="space-y-4">
                    {daysOfWeek.map((day) => (
                        <DayRow
                            key={day}
                            dayData={
                                openingHours.find((h) => h.day_of_week === day) ??
                                defaultDayData(day)
                            }
                            onChange={handleDayChange}
                            disabled={!enabled}
                            labels={dayLabels[day]}
                            onLabelsChange={(updated) =>
                                setDayLabels((prev) => ({ ...prev, [day]: updated }))
                            }
                        />
                    ))}
                </div>
                <div className="mt-6 flex justify-end">
                    {hasChanges && (
                        <Button color="gray" onClick={handleUndo}>
                            {t("undo")}
                        </Button>
                    )}
                    <Button
                        color="primary"
                        disabled={saveMutation.isPending}
                        onClick={() => saveMutation.mutate()}
                        className="flex items-center disabled:opacity-50"
                    >
                        {saveMutation.isPending && (
                            <Spinner size="sm" className="mr-2 text-white" />
                        )}
                        {saveMutation.isPending ? t("saving") : t("save_opening_hours")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
