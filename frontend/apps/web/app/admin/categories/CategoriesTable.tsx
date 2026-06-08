"use client";

import { useTranslations } from "next-intl";
import { Badge, TextButton } from "shared-components";
import { AdminTable } from "@/components/admin";
import type { AdminTableColumn } from "@/components/admin/AdminTable";
import type { CategoryInterface } from "shared-utils";

interface CategoriesTableProps {
    categories: CategoryInterface[];
    defaultLocale: string;
    deletingId: number | null;
    onEdit: (category: CategoryInterface) => void;
    onDelete: (categoryId: number) => void;
}

export default function CategoriesTable({
    categories,
    defaultLocale,
    deletingId,
    onEdit,
    onDelete,
}: CategoriesTableProps) {
    const t = useTranslations();

    const columns: AdminTableColumn[] = [
        { header: t("short_name") },
        { header: t("default_language_name") },
        { header: t("actions"), align: "right" },
    ];

    return (
        <AdminTable columns={columns}>
            {categories.length === 0 ? (
                <tr>
                    <td colSpan={3} className="text-text-2 px-6 py-8 text-center text-sm">
                        {t("category_list_is_empty")}
                    </td>
                </tr>
            ) : (
                categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <Badge color="blue" className="font-bold">
                                {category.short_name}
                            </Badge>
                        </td>
                        <td className="text-text-1 px-6 py-4 text-sm whitespace-nowrap">
                            {(category.name as Record<string, string>)[defaultLocale] ||
                                category.name.en ||
                                "-"}
                        </td>
                        <td className="px-6 py-4 text-right text-sm whitespace-nowrap">
                            <TextButton onClick={() => onEdit(category)} className="mr-3">
                                {t("edit")}
                            </TextButton>
                            <TextButton
                                onClick={() => onDelete(category.id)}
                                disabled={deletingId === category.id}
                                color="red"
                            >
                                {t("delete")}
                            </TextButton>
                        </td>
                    </tr>
                ))
            )}
        </AdminTable>
    );
}
