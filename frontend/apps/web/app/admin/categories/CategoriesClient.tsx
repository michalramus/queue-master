"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
    createCategory,
    updateCategory,
    deleteCategory,
    assignDeskToCategory,
    removeDeskFromCategory,
    useCategories,
    useGlobalSettings,
    sseEvents,
    LangCode,
    type CategoryInterface,
    type CategoryCreateDto,
    type CategoryUpdateDto,
} from "shared-utils";
import { useSse } from "@/utils/hooks/useSse";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { Button, ConfirmModal } from "shared-components";
import { showToast } from "@/utils/toast";
import { PageHeader } from "@/components/admin";
import CategoriesTable from "./CategoriesTable";
import CategoryModal from "./CategoryModal";

export default function CategoriesClient() {
    const t = useTranslations();
    const queryClient = useQueryClient();
    const { addEventListener, removeEventListener } = useSse();

    const { data: categories = [] } = useCategories(axiosAuthInstance);
    const { data: globalSettings } = useGlobalSettings(axiosPureInstance);
    const defaultLocale: LangCode = (globalSettings?.locale as LangCode) ?? LangCode.en;

    //SSE: invalidate categories and desks queries when categories are changed
    useEffect(() => {
        function onCategoriesChanged() {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["desks"] });
        }
        addEventListener(sseEvents.CategoriesChanged, onCategoriesChanged);
        return () => removeEventListener(sseEvents.CategoriesChanged, onCategoriesChanged);
    }, [queryClient, addEventListener, removeEventListener]);

    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const editingCategory =
        editingCategoryId !== null
            ? (categories.find((c) => c.id === editingCategoryId) ?? null)
            : null;

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
        mutationFn: async ({ dto, deskIds }: { dto: CategoryCreateDto; deskIds: number[] }) => {
            const category = await createCategory(axiosAuthInstance, dto);
            await Promise.all(
                deskIds.map((deskId) =>
                    assignDeskToCategory(axiosAuthInstance, category.id, deskId),
                ),
            );
        },
        onSuccess: () => {
            showToast.success(t("category_created_successfully"));
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setModalOpen(false);
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            showToast.error(err.response?.data?.message || t("failed_save_category"));
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({
            id,
            dto,
            addedDeskIds,
            removedDeskIds,
        }: {
            id: number;
            dto: CategoryUpdateDto;
            addedDeskIds: number[];
            removedDeskIds: number[];
        }) => {
            await updateCategory(axiosAuthInstance, id, dto);
            await Promise.all([
                ...addedDeskIds.map((deskId) =>
                    assignDeskToCategory(axiosAuthInstance, id, deskId),
                ),
                ...removedDeskIds.map((deskId) =>
                    removeDeskFromCategory(axiosAuthInstance, id, deskId),
                ),
            ]);
        },
        onSuccess: () => {
            showToast.success(t("category_updated_successfully"));
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setModalOpen(false);
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            showToast.error(err.response?.data?.message || t("failed_save_category"));
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (categoryId: number) => deleteCategory(axiosAuthInstance, categoryId),
        onMutate: (categoryId: number) => setDeletingId(categoryId),
        onSuccess: () => {
            showToast.success(t("category_deleted_successfully"));
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            showToast.error(err.response?.data?.message || t("failed_delete_category"));
        },
        onSettled: () => setDeletingId(null),
    });

    function handleCreate() {
        setEditingCategoryId(null);
        setModalOpen(true);
    }

    function handleEdit(category: CategoryInterface) {
        setEditingCategoryId(category.id);
        setModalOpen(true);
    }

    function handleDelete(categoryId: number) {
        setConfirmModal({
            isOpen: true,
            title: t("are_you_sure"),
            message: t("are_you_sure_delete_category") + " " + t("action_cannot_be_undone"),
            type: "danger",
            onConfirm: () => {
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                deleteMutation.mutate(categoryId);
            },
        });
    }

    const usedLetters = new Set(categories.map((c) => c.short_name.toUpperCase()));
    const availableLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        .split("")
        .filter((letter) => !usedLetters.has(letter));

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <div>
            <PageHeader
                title={t("categories_management")}
                action={
                    <Button onClick={handleCreate} color="primary" className="m-0!">
                        + {t("add_category")}
                    </Button>
                }
            />

            <CategoriesTable
                categories={categories}
                defaultLocale={defaultLocale}
                deletingId={deletingId}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <CategoryModal
                isOpen={modalOpen}
                editingCategory={editingCategory}
                defaultLocale={defaultLocale}
                saving={isSaving}
                availableLetters={availableLetters}
                onClose={() => setModalOpen(false)}
                onCreate={(dto, deskIds) => createMutation.mutate({ dto, deskIds })}
                onUpdate={(dto, addedDeskIds, removedDeskIds) =>
                    editingCategory &&
                    updateMutation.mutate({
                        id: editingCategory.id,
                        dto,
                        addedDeskIds,
                        removedDeskIds,
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
