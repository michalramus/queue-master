"use client";

import { useTranslations } from "next-intl";
import { Badge, TextButton } from "shared-components";
import { AdminTable } from "@/components/admin";
import type { AdminTableColumn } from "@/components/admin/AdminTable";
import type { UserResponseDto } from "shared-utils";

interface UsersTableProps {
    users: UserResponseDto[];
    deleting: boolean;
    onEdit: (user: UserResponseDto) => void;
    onDelete: (userId: number) => void;
}

export default function UsersTable({ users, deleting, onEdit, onDelete }: UsersTableProps) {
    const t = useTranslations();

    const columns: AdminTableColumn[] = [
        { header: t("id") },
        { header: t("username") },
        { header: t("role") },
        { header: t("desk") },
        { header: t("actions"), align: "right" },
    ];

    return (
        <AdminTable columns={columns}>
            {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                    <td className="text-text-1 px-6 py-4 text-sm whitespace-nowrap">{user.id}</td>
                    <td className="text-text-1 px-6 py-4 text-sm whitespace-nowrap">
                        {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <Badge color={user.role === "Admin" ? "primary" : "blue"}>
                            {user.role}
                        </Badge>
                    </td>
                    <td className="text-text-1 px-6 py-4 text-sm whitespace-nowrap">
                        {user.default_desk?.desk_name ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap">
                        <TextButton onClick={() => onEdit(user)} className="mr-3">
                            {t("edit_and_settings")}
                        </TextButton>
                        <TextButton
                            onClick={() => onDelete(user.id)}
                            disabled={deleting}
                            color="red"
                        >
                            {t("delete")}
                        </TextButton>
                    </td>
                </tr>
            ))}
        </AdminTable>
    );
}
