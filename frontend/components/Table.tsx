import { ReactNode } from "react";

export default function Table({
    columns,
    rows,
    theadClassName,
    tbodyClassName,
}: {
    columns: (string | number | ReactNode)[];
    rows: (string | number | ReactNode | null)[][];
    theadClassName?: string;
    tbodyClassName?: string;
}) {
    return (
        <div className="overflow-x-auto mx-2">
            <table className="w-full text-center">
                <thead className={`text-gray-1 border-gray-2 border-b-2 text-md ${theadClassName}`}>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index} scope="col" className="px-6 py-1">
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={`text-xl font-medium ${tbodyClassName}`}>
                    {rows.map((row, index) => (
                        <tr key={index} className="border-gray-2 border-b-2 border-opacity-50">
                            {row.map((element, elementIndex) => (
                                <td key={elementIndex} className="px-6 py-2">
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
