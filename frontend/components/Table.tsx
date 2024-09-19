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
                <thead className={`text-md border-b-2 border-gray-2 text-gray-1 ${theadClassName}`}>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index} scope="col" className="px-6 py-1">
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={`text-xl font-medium`}>
                    {rows.map((row, index) => (
                        <tr
                            key={index}
                            className={`border-b-2 border-gray-2 border-opacity-50 ${tbodyClassName}`}
                        >
                            {row.map((element, elementIndex) => (
                                <td key={elementIndex} className={`px-6 py-2 ${tdBodyClassName}`}>
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
