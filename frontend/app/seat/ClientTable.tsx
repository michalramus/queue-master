import React from "react";
import { ClientNumber, removeClient, setClientAsInService } from "@/api/clients";
import { useMutation } from "@tanstack/react-query";
import SmallAcceptButton from "@/components/buttons/SmallAcceptButton";
import SmallRejectButton from "@/components/buttons/SmallRejectButton";

/**
 * Table with clients waiting for service
 * @param categoryIds - clients with these categories will be displayed
 * @component
 */
export default function ClientTable({
    clientNumbers,
    categoryIds,
    seat,
}: {
    clientNumbers: ClientNumber[] | undefined;
    categoryIds: string[];
    seat: number;
}) {
    return (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-center text-sm text-gray-400 rtl:text-right">
                <thead className="bg-gray-700 text-xs uppercase text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Number
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Category
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Creation Date
                        </th>
                        <th scope="col" className="px-6 py-3" />
                    </tr>
                </thead>
                <tbody>
                    {clientNumbers?.map((client) => {
                        if (categoryIds.includes(client.categoryId)) {
                            return (
                                <ClientTableRow
                                    key={client.number}
                                    clientNumber={client}
                                    seat={seat}
                                />
                            );
                        }
                    })}
                </tbody>
            </table>
        </div>
    );
}

/**
 * Table row with client number, category, creation date and buttons to accept or reject the client
 */
function ClientTableRow({ clientNumber, seat }: { clientNumber: ClientNumber; seat: number }) {
    
    //----------------------------------------
    //Api calls

    // set client as in service
    const clientInService = useMutation({
        mutationFn: ({ clientNumber }: { clientNumber: ClientNumber }) =>
            setClientAsInService(clientNumber, seat),
    });

    // remove client
    const deleteClient = useMutation({
        mutationFn: ({ clientNumber }: { clientNumber: ClientNumber }) =>
            removeClient(clientNumber),
    });
    //----------------------------------------

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
                {new Date(clientNumber.creationDate).toLocaleDateString("en-EN", {
                    hour12: false,
                })}
            </td>
            <td className="px-6 py-4">
                <SmallRejectButton onClick={() => deleteClient.mutate({ clientNumber })} />
                <SmallAcceptButton onClick={() => clientInService.mutate({ clientNumber })} />
            </td>
        </tr>
    );
}
