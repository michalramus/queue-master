"use client";

import { useState, useLayoutEffect } from "react";
import { useTranslations } from "next-intl";
import {
    useCategories,
    type DeskInterface,
    type DeskCreateDto,
    type DeskUpdateDto,
} from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import {
    Modal,
    Button,
    Input,
    NumericStepper,
    Badge,
    Select,
    Spinner,
    RejectIcon,
} from "shared-components";
import { showToast } from "@/utils/toast";

interface DeskModalProps {
    isOpen: boolean;
    editingDesk: DeskInterface | null;
    saving: boolean;
    onClose: () => void;
    onCreate: (dto: DeskCreateDto, categoryIds: number[]) => void;
    onUpdate: (
        dto: DeskUpdateDto,
        addedCategoryIds: number[],
        removedCategoryIds: number[],
    ) => void;
}

export default function DeskModal({
    isOpen,
    editingDesk,
    saving,
    onClose,
    onCreate,
    onUpdate,
}: DeskModalProps) {
    const t = useTranslations();

    const [deskNumber, setDeskNumber] = useState(1);
    const [deskName, setDeskName] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [localCategoryIds, setLocalCategoryIds] = useState<number[]>([]);

    const { data: categories = [] } = useCategories(axiosAuthInstance);

    useLayoutEffect(() => {
        if (!isOpen) return;
        if (editingDesk) {
            setDeskNumber(editingDesk.desk_number);
            setDeskName(editingDesk.desk_name);
            setLocalCategoryIds(editingDesk.categories?.map((c) => c.id) ?? []);
        } else {
            setDeskNumber(1);
            setDeskName("");
            setLocalCategoryIds([]);
        }
        setSelectedCategoryId("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, editingDesk?.id]);

    const localSet = new Set(localCategoryIds);
    const unassignedCategories = categories.filter((c) => !localSet.has(c.id));
    const assignedCategories = categories.filter((c) => localSet.has(c.id));

    function handleSave() {
        if (!deskName.trim()) {
            showToast.error(t("desk_name_required"));
            return;
        }
        if (editingDesk) {
            const originalIds = new Set(editingDesk.categories?.map((c) => c.id) ?? []);
            const addedCategoryIds = localCategoryIds.filter((id) => !originalIds.has(id));
            const removedCategoryIds = [...originalIds].filter((id) => !localSet.has(id));
            onUpdate(
                { desk_number: deskNumber, desk_name: deskName.trim() },
                addedCategoryIds,
                removedCategoryIds,
            );
        } else {
            onCreate({ desk_number: deskNumber, desk_name: deskName.trim() }, localCategoryIds);
        }
    }

    return (
        <Modal hidden={!isOpen} color="background">
            <div className="w-full max-w-lg p-6">
                <p className="text-text-1 mb-4 text-xl font-bold">
                    {editingDesk ? t("edit_desk") : t("create_desk")}
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="text-text-1 mb-1 block text-sm font-medium">
                            {t("desk_number")}
                        </label>
                        <NumericStepper
                            value={deskNumber}
                            min={1}
                            max={999}
                            onChange={setDeskNumber}
                        />
                    </div>

                    <Input
                        label={t("desk_name")}
                        value={deskName}
                        onChange={(e) => setDeskName(e.target.value)}
                        placeholder={t("desk_name_placeholder")}
                    />

                    <div>
                        <label className="text-text-1 mb-2 block text-sm font-medium">
                            {t("assigned_categories")}
                        </label>

                        <div className="mb-3 flex flex-wrap gap-2">
                            {assignedCategories.length > 0 ? (
                                assignedCategories.map((cat) => (
                                    <Badge
                                        key={cat.id}
                                        color="blue"
                                        className="flex items-center gap-1 font-bold"
                                    >
                                        {cat.short_name}
                                        <button
                                            onClick={() =>
                                                setLocalCategoryIds((prev) =>
                                                    prev.filter((id) => id !== cat.id),
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
                                    {t("no_categories_assigned")}
                                </span>
                            )}
                        </div>

                        {unassignedCategories.length > 0 && (
                            <div className="flex gap-2">
                                <Select
                                    value={selectedCategoryId}
                                    onChange={(val) => setSelectedCategoryId(val)}
                                    className="flex-1"
                                >
                                    <option value="">{t("choose_category")}</option>
                                    {unassignedCategories.map((cat) => (
                                        <option key={cat.id} value={String(cat.id)}>
                                            {cat.short_name}
                                        </option>
                                    ))}
                                </Select>
                                <Button
                                    color="primary"
                                    className="m-0! shrink-0"
                                    disabled={!selectedCategoryId}
                                    onClick={() => {
                                        if (selectedCategoryId) {
                                            setLocalCategoryIds((prev) => [
                                                ...prev,
                                                Number(selectedCategoryId),
                                            ]);
                                            setSelectedCategoryId("");
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
                        className="m-0! flex items-center text-white"
                    >
                        {saving && <Spinner size="sm" className="mr-2 text-white" />}
                        {saving ? t("saving") : t("save")}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
