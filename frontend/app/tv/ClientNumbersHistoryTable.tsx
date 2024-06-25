import { ClientNumber } from "../../api/clients";
function ClientNumbersHistoryRow({ clientNumber }: { clientNumber: ClientNumber }) {
    return (
        <tr className="border-b border-gray-700 odd:bg-gray-900 even:bg-gray-800">
            <th scope="row" className="whitespace-nowrap px-6 py-4">
                {clientNumber.number}
            </th>
            <td className="px-6 py-4">{clientNumber.seat}</td>
        </tr>
    );
}

export default function ClientNumbersHistory({ clientNumbers }: { clientNumbers: ClientNumber[] }) {
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-center text-sm text-gray-400">
                <thead className="bg-gray-700 text-3xl uppercase text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Number
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Seat
                        </th>
                    </tr>
                </thead>
                <tbody className="text-3xl font-bold text-white">
                    {clientNumbers.map((clientNumber) => (
                        <ClientNumbersHistoryRow
                            key={clientNumber.number}
                            clientNumber={clientNumber}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
