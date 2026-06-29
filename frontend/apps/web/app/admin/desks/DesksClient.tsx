"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
    createDesk,
    updateDesk,
    deleteDesk,
    assignCategoryToDesk,
    removeCategoryFromDesk,
    useDesks,
    useCategories,
    useGlobalSettings,
    sseEvents,
    LangCode,
    type DeskInterface,
    type DeskCreateDto,
    type DeskUpdateDto,
} from "shared-utils";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { useSse } from "@/utils/hooks/useSse";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { Button, ConfirmModal } from "shared-components";
import { showToast } from "@/utils/toast";
import { PageHeader } from "@/components/admin";
import DesksTable from "./DesksTable";
import DeskModal from "./DeskModal";

export default function DesksClient() {
    const t = useTranslations();
    const queryClient = useQueryClient();
    const { addEventListener, removeEventListener } = useSse();

    const { data: desks = [] } = useDesks(axiosAuthInstance);
    const { data: allCategories = [] } = useCategories(axiosAuthInstance);
    const { data: globalSettings } = useGlobalSettings(axiosPureInstance);
    const defaultLocale: LangCode = (globalSettings?.locale as LangCode) ?? LangCode.en;

    useEffect(() => {
        function onCategoriesChanged() {
            queryClient.invalidateQueries({ queryKey: ["desks"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        }
        addEventListener(sseEvents.CategoriesChanged, onCategoriesChanged);
        return () => removeEventListener(sseEvents.CategoriesChanged, onCategoriesChanged);
    }, [queryClient, addEventListener, removeEventListener]);

    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDeskId, setEditingDeskId] = useState<number | null>(null);
    const editingDesk =
        editingDeskId !== null ? (desks.find((d) => d.id === editingDeskId) ?? null) : null;

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        type?: "danger" | "warning" | "info" | "primary";
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {},
        type: "primary",
    });

    const createMutation = useMutation({
        mutationFn: async ({ dto, categoryIds }: { dto: DeskCreateDto; categoryIds: number[] }) => {
            const desk = await createDesk(axiosAuthInstance, dto);
            await Promise.all(
                categoryIds.map((categoryId) =>
                    assignCategoryToDesk(axiosAuthInstance, desk.id, categoryId),
                ),
            );
        },
        onSuccess: () => {
            showToast.success(t("desk_created_successfully"));
            queryClient.invalidateQueries({ queryKey: ["desks"] });
            setModalOpen(false);
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            showToast.error(err.response?.data?.message ?? t("failed_save_desk"));
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({
            id,
            dto,
            addedCategoryIds,
            removedCategoryIds,
        }: {
            id: number;
            dto: DeskUpdateDto;
            addedCategoryIds: number[];
            removedCategoryIds: number[];
        }) => {
            await updateDesk(axiosAuthInstance, id, dto);
            await Promise.all([
                ...addedCategoryIds.map((catId) =>
                    assignCategoryToDesk(axiosAuthInstance, id, catId),
                ),
                ...removedCategoryIds.map((catId) =>
                    removeCategoryFromDesk(axiosAuthInstance, id, catId),
                ),
            ]);
        },
        onSuccess: () => {
            showToast.success(t("desk_updated_successfully"));
            queryClient.invalidateQueries({ queryKey: ["desks"] });
            setModalOpen(false);
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            showToast.error(err.response?.data?.message ?? t("failed_save_desk"));
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (deskId: number) => deleteDesk(axiosAuthInstance, deskId),
        onMutate: (deskId: number) => setDeletingId(deskId),
        onSuccess: () => {
            showToast.success(t("desk_deleted_successfully"));
            queryClient.invalidateQueries({ queryKey: ["desks"] });
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            showToast.error(err.response?.data?.message ?? t("failed_delete_desk"));
        },
        onSettled: () => setDeletingId(null),
    });

    function handleCreate() {
        setEditingDeskId(null);
        setModalOpen(true);
    }

    function handleEdit(desk: DeskInterface) {
        setEditingDeskId(desk.id);
        setModalOpen(true);
    }

    function handleDelete(deskId: number) {
        const desk = desks.find((d) => d.id === deskId);
        setConfirmModal({
            isOpen: true,
            title: t("are_you_sure"),
            message: t("are_you_sure_delete_desk") + " " + t("action_cannot_be_undone"),
            type: "danger",
            onConfirm: () => {
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                deleteMutation.mutate(deskId);
            },
        });
        void desk;
    }

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <div>
            <PageHeader
                title={t("desks_management")}
                action={
                    <Button onClick={handleCreate} color="primary" className="m-0!">
                        + {t("add_desk")}
                    </Button>
                }
            />

            <DesksTable
                desks={desks}
                allCategories={allCategories}
                defaultLocale={defaultLocale}
                deletingId={deletingId}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <DeskModal
                isOpen={modalOpen}
                editingDesk={editingDesk}
                saving={isSaving}
                onClose={() => setModalOpen(false)}
                onCreate={(dto, categoryIds) => createMutation.mutate({ dto, categoryIds })}
                onUpdate={(dto, addedCategoryIds, removedCategoryIds) =>
                    editingDesk &&
                    updateMutation.mutate({
                        id: editingDesk.id,
                        dto,
                        addedCategoryIds,
                        removedCategoryIds,
                    })
                }
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={t("confirm")}
                cancelText={t("cancel")}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                type={confirmModal.type}
            />
        </div>
    );
}
