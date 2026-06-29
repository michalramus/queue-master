"use client";

import { useTranslations } from "next-intl";
import { Badge, TextButton } from "shared-components";
import { AdminTable } from "@/components/admin";
import type { AdminTableColumn } from "@/components/admin/AdminTable";
import type { DeviceResponseDto } from "shared-utils";

interface DevicesTableProps {
    devices: DeviceResponseDto[];
    deleting: boolean;
    onToggle: (deviceId: number, accepted: boolean) => void;
    onEdit: (device: DeviceResponseDto) => void;
    onDelete: (deviceId: number) => void;
}

export default function DevicesTable({
    devices,
    deleting,
    onToggle,
    onEdit,
    onDelete,
}: DevicesTableProps) {
    const t = useTranslations();

    const columns: AdminTableColumn[] = [
        { header: t("id") },
        { header: t("status") },
        { header: t("comment") },
        { header: t("actions"), align: "right" },
    ];

    return (
        <AdminTable columns={columns}>
            {devices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-50">
                    <td className="text-text-1 px-6 py-4 text-sm whitespace-nowrap">{device.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <Badge color={device.accepted ? "green" : "red"}>
                            {device.accepted ? t("active") : t("inactive")}
                        </Badge>
                    </td>
                    <td className="text-text-1 max-w-xs truncate px-6 py-4 text-sm">
                        {device.comment || "-"}
                    </td>
                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap">
                        <TextButton
                            onClick={() => onToggle(device.id, !device.accepted)}
                            className="mr-3"
                        >
                            {device.accepted ? t("deactivate") : t("activate")}
                        </TextButton>
                        <TextButton onClick={() => onEdit(device)} className="mr-3">
                            {t("edit")}
                        </TextButton>
                        <TextButton
                            onClick={() => onDelete(device.id)}
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
