interface ClientRowProps {
    onClick: (number: number) => void;
    number: number;
    category: string;
    creationDate: string;
}

export default function ClientRow({
    onClick,
    number,
    category,
    creationDate,
}: ClientRowProps) {
    return (
        <tr className="border-b border-gray-700 odd:bg-gray-900 even:bg-gray-800">
            <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-white"
            >
                {number}
            </th>
            <td className="px-6 py-4">{category}</td>
            <td className="px-6 py-4">{creationDate}</td>
            <td className="px-6 py-4">
                <button
                    type="button"
                    className="me-2 inline-flex items-center rounded-full bg-green-600 p-2.5 text-center text-sm font-medium text-white hover:bg-green-700"
                    onClick={() => onClick(number)}
                >
                    <svg
                        className="h-4 w-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                    </svg>
                </button>
            </td>
        </tr>
    );
}
