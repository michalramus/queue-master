import { ReactNode } from "react";

export interface AdminTableColumn {
    header: string;
    align?: "left" | "center" | "right";
}

interface AdminTableProps {
    columns: AdminTableColumn[];
    children: ReactNode;
    className?: string;
}

const alignClass: Record<NonNullable<AdminTableColumn["align"]>, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

export default function AdminTable({ columns, children, className = "" }: AdminTableProps) {
    return (
        <div className={`overflow-hidden rounded-lg bg-white shadow ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${alignClass[column.align ?? "left"]}`}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
            </table>
        </div>
    );
}
