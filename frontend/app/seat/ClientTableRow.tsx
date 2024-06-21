import { ClientNumber, setClientAsInService, removeClient } from "@/api/clients";
import SmallRejectButton from "@/components/buttons/SmallRejectButton";
import SmallAcceptButton from "@/components/buttons/SmallAcceptButton";
import { useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";

export default function ClientTableRow({
    clientNumber,
    seat,
}: {
    clientNumber: ClientNumber;
    seat: number;
}) {
    // set client as in service
    const clientInService = useMutation({
        mutationFn: ({ clientNumber, seat }: { clientNumber: ClientNumber; seat: number }) =>
            setClientAsInService(clientNumber, seat),
    });

    // remove client
    const deleteClient = useMutation({
        mutationFn: ({ clientNumber }: { clientNumber: ClientNumber }) =>
            removeClient(clientNumber),
    });

    return (
        <tr className="border-b border-gray-700 odd:bg-gray-900 even:bg-gray-800">
            <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-white">
                {clientNumber.number}
            </th>
            <td className="px-6 py-4">{clientNumber.category.name}</td>
            <td className="px-6 py-4">
                <span className="text-white">
                    {new Date(clientNumber.creationDate).toLocaleTimeString("pl-PL")}
                </span>
                <br />
                {new Date(clientNumber.creationDate).toLocaleDateString("en-EN", { hour12: false })}
            </td>
            <td className="px-6 py-4">
                <SmallRejectButton onClick={() => deleteClient.mutate({ clientNumber })} />
                <SmallAcceptButton onClick={() => clientInService.mutate({ clientNumber, seat })} />
            </td>
        </tr>
    );
}
