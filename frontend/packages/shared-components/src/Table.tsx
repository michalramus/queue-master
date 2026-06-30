import { ReactNode } from "react";

export default function Table({
    columns,
    rows,
    theadClassName,
    tbodyClassName,
    tdBodyClassName,
    className,
}: {
    columns: (string | number | ReactNode)[];
    rows: (string | number | ReactNode | null)[][];
    theadClassName?: React.ComponentProps<"div">["className"];
    tbodyClassName?: React.ComponentProps<"div">["className"];
    tdBodyClassName?: React.ComponentProps<"div">["className"];
    className?: React.ComponentProps<"div">["className"];
}) {
    return (
        <div className={`mx-2 overflow-x-auto ${className}`}>
            <table className="w-full text-center">
                <thead className={`text-md border-gray-1 text-text-2 border-b-2 ${theadClassName}`}>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index} scope="col" className="px-2 py-1 sm:px-4 lg:px-6">
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={`text-xl font-medium`}>
                    {rows.map((row, index) => (
                        <tr
                            key={index}
                            className={`border-gray-1 border-opacity-50 border-b-2 ${tbodyClassName}`}
                        >
                            {row.map((element, elementIndex) => (
                                <td
                                    key={elementIndex}
                                    className={`px-2 py-2 sm:px-4 lg:px-6 ${tdBodyClassName}`}
                                >
                                    {element}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
