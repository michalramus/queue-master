"use client";

import { useTranslations } from "next-intl";
import { Badge, TextButton } from "shared-components";
import { AdminTable } from "@/components/admin";
import type { AdminTableColumn } from "@/components/admin/AdminTable";
import type { CategoryInterface, DeskInterface, LangCode } from "shared-utils";

interface DesksTableProps {
    desks: DeskInterface[];
    allCategories: CategoryInterface[];
    defaultLocale: LangCode;
    deletingId: number | null;
    onEdit: (desk: DeskInterface) => void;
    onDelete: (deskId: number) => void;
}

export default function DesksTable({
    desks,
    allCategories,
    defaultLocale,
    deletingId,
    onEdit,
    onDelete,
}: DesksTableProps) {
    const t = useTranslations();

    const columns: AdminTableColumn[] = [
        { header: t("desk_number") },
        { header: t("desk_name") },
        { header: t("categories") },
        { header: t("actions"), align: "right" },
    ];

    return (
        <AdminTable columns={columns}>
            {desks.length === 0 ? (
                <tr>
                    <td colSpan={4} className="text-text-2 px-6 py-8 text-center text-sm">
                        {t("desk_list_is_empty")}
                    </td>
                </tr>
            ) : (
                desks.map((desk) => (
                    <tr key={desk.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                            <span className="text-text-1 font-medium">#{desk.desk_number}</span>
                        </td>
                        <td className="text-text-1 px-6 py-4 text-sm whitespace-nowrap">
                            {desk.desk_name}
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                                {desk.categories && desk.categories.length > 0 ? (
                                    desk.categories.map((cat) => {
                                        const full = allCategories.find((c) => c.id === cat.id);
                                        const label =
                                            full?.name[defaultLocale] ??
                                            full?.name[Object.keys(full.name)[0] as LangCode] ??
                                            cat.short_name;
                                        return (
                                            <Badge key={cat.id} color="blue">
                                                {label}
                                            </Badge>
                                        );
                                    })
                                ) : (
                                    <span className="text-text-2 text-sm">—</span>
                                )}
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm whitespace-nowrap">
                            <TextButton onClick={() => onEdit(desk)} className="mr-3">
                                {t("edit")}
                            </TextButton>
                            <TextButton
                                onClick={() => onDelete(desk.id)}
                                disabled={deletingId === desk.id}
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
