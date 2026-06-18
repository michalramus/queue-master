"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Modal, Button, Spinner, Input, Select, Badge, RejectIcon } from "shared-components";
import { showToast } from "@/utils/toast";
import { LangCode, useDesks } from "shared-utils";
import type { CategoryInterface, CategoryCreateDto, CategoryUpdateDto } from "shared-utils";
import { langLabelKey, initLangRecord } from "@/i18n/langLabels";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";

interface CategoryModalProps {
    isOpen: boolean;
    editingCategory: CategoryInterface | null;
    defaultLocale: LangCode;
    saving: boolean;
    availableLetters: string[];
    onClose: () => void;
    onCreate: (dto: CategoryCreateDto, deskIds: number[]) => void;
    onUpdate: (dto: CategoryUpdateDto, addedDeskIds: number[], removedDeskIds: number[]) => void;
}

export default function CategoryModal({
    isOpen,
    editingCategory,
    defaultLocale,
    saving,
    availableLetters,
    onClose,
    onCreate,
    onUpdate,
}: CategoryModalProps) {
    const t = useTranslations();

    const sortedLocales = Object.values(LangCode).sort((a, b) =>
        a === defaultLocale ? -1 : b === defaultLocale ? 1 : 0,
    );

    const [shortName, setShortName] = useState<string>("");
    const [name, setName] = useState<Record<LangCode, string>>(() => initLangRecord(() => ""));
    const [selectedDeskId, setSelectedDeskId] = useState<string>("");
    const [localDeskIds, setLocalDeskIds] = useState<number[]>([]);

    const { data: desks = [] } = useDesks(axiosAuthInstance);

    useEffect(() => {
        if (!isOpen) return;
        setShortName(editingCategory?.short_name ?? "");
        setName(initLangRecord((lang) => editingCategory?.name[lang] ?? ""));
        setLocalDeskIds(editingCategory?.desks?.map((d) => d.id) ?? []);
        setSelectedDeskId("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const localSet = new Set(localDeskIds);
    const unassignedDesks = desks.filter((d) => !localSet.has(d.id));
    const assignedDesks = desks.filter((d) => localSet.has(d.id));

    const handleSave = () => {
        const filteredName: CategoryCreateDto["name"] = {};
        for (const lang of Object.values(LangCode)) {
            if (name[lang].trim()) filteredName[lang] = name[lang];
        }

        if (Object.keys(filteredName).length === 0) {
            showToast.error(t("please_provide_translation"));
            return;
        }
        if (!shortName.trim()) {
            showToast.error(t("please_provide_short_name"));
            return;
        }

        if (editingCategory) {
            const originalIds = new Set(editingCategory.desks?.map((d) => d.id) ?? []);
            const addedDeskIds = localDeskIds.filter((id) => !originalIds.has(id));
            const removedDeskIds = [...originalIds].filter((id) => !localSet.has(id));
            onUpdate({ short_name: shortName, name: filteredName }, addedDeskIds, removedDeskIds);
        } else {
            onCreate({ short_name: shortName, name: filteredName }, localDeskIds);
        }
    };

    return (
        <Modal hidden={!isOpen} color="background">
            <div className="w-full max-w-md p-6">
                <p className="text-text-1 mb-4 text-xl font-bold">
                    {editingCategory ? t("edit_category") : t("create_category")}
                </p>
                <div className="space-y-4">
                    {!editingCategory && availableLetters.length === 0 ? (
                        <p className="text-red-1 text-sm">{t("no_available_letters")}</p>
                    ) : (
                        <Select
                            label={t("short_name")}
                            value={shortName}
                            onChange={(value) => setShortName(value)}
                            hint={t("short_name_description")}
                        >
                            {editingCategory ? (
                                <option value={editingCategory.short_name}>
                                    {editingCategory.short_name} ({t("current")})
                                </option>
                            ) : (
                                <option value="">{t("select_letter")}</option>
                            )}
                            {editingCategory && availableLetters.length > 0 ? (
                                <optgroup label={t("available_letters")}>
                                    {availableLetters.map((letter) => (
                                        <option key={letter} value={letter}>
                                            {letter}
                                        </option>
                                    ))}
                                </optgroup>
                            ) : (
                                availableLetters.map((letter) => (
                                    <option key={letter} value={letter}>
                                        {letter}
                                    </option>
                                ))
                            )}
                        </Select>
                    )}

                    {sortedLocales.map((lang) => (
                        <Input
                            key={lang}
                            label={`${t(langLabelKey[lang])}${lang === defaultLocale ? " *" : ""}`}
                            value={name[lang]}
                            onChange={(e) =>
                                setName((prev) => ({ ...prev, [lang]: e.target.value }))
                            }
                        />
                    ))}

                    <div>
                        <label className="text-text-1 mb-2 block text-sm font-medium">
                            {t("assigned_desks")}
                        </label>

                        <div className="mb-3 flex flex-wrap gap-2">
                            {assignedDesks.length > 0 ? (
                                assignedDesks.map((desk) => (
                                    <Badge
                                        key={desk.id}
                                        color="primary"
                                        className="flex items-center gap-1"
                                    >
                                        {desk.desk_name}
                                        <button
                                            onClick={() =>
                                                setLocalDeskIds((prev) =>
                                                    prev.filter((id) => id !== desk.id),
                                                )
                                            }
                                            className="text-red-1 leading-none font-bold hover:text-red-700"
                                            aria-label={t("remove")}
                                        >
                                            <RejectIcon />
                                        </button>
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-text-2 text-sm">
                                    {t("no_desks_assigned")}
                                </span>
                            )}
                        </div>

                        {unassignedDesks.length > 0 && (
                            <div className="flex gap-2">
                                <Select
                                    value={selectedDeskId}
                                    onChange={(val) => setSelectedDeskId(val)}
                                    className="flex-1"
                                >
                                    <option value="">{t("choose_desk")}</option>
                                    {unassignedDesks.map((desk) => (
                                        <option key={desk.id} value={String(desk.id)}>
                                            {desk.desk_name} (#{desk.desk_number})
                                        </option>
                                    ))}
                                </Select>
                                <Button
                                    color="primary"
                                    className="m-0! shrink-0"
                                    disabled={!selectedDeskId}
                                    onClick={() => {
                                        if (selectedDeskId) {
                                            setLocalDeskIds((prev) => [
                                                ...prev,
                                                Number(selectedDeskId),
                                            ]);
                                            setSelectedDeskId("");
                                        }
                                    }}
                                >
                                    {t("add")}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <Button onClick={onClose} disabled={saving} color="gray" className="m-0!">
                        {t("cancel")}
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        color="primary"
                        className="m-0! flex items-center"
                    >
                        {saving && <Spinner size="sm" className="mr-2 text-white" />}
                        {saving ? t("saving") : t("save")}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
