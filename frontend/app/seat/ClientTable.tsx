"use client";

import React, { ReactNode } from "react";
import { ClientInterface, removeClient, setClientAsInService } from "@/utils/api/CSR/clients";
import { useMutation } from "@tanstack/react-query";
import Table from "@/components/Table";
import Button from "@/components/Buttons/Button";
import AcceptIcon from "../../components/svg/AcceptIcon";
import RejectIcon from "@/components/svg/RejectIcon";

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
    clientNumbers: ClientInterface[] | undefined;
    categoryIds: number[];
    seat: number;
}) {
    //----------------------------------------
    //Api calls

    // set client as in service
    const clientInService = useMutation({
        mutationFn: (clientNumber: ClientInterface) => setClientAsInService(clientNumber, seat),
    });

    // remove client
    const deleteClient = useMutation({
        mutationFn: (clientNumber: ClientInterface) => removeClient(clientNumber),
    });
    //----------------------------------------

    //Prepare table content
    const filteredClientNumbers = clientNumbers?.filter(
        (client) => categoryIds.indexOf(client.category_id) != -1,
    );

    const columns = ["Number", "Category", "Creation Date", ""];
    const rows: (string | number | ReactNode | null)[][] = [];
    filteredClientNumbers?.forEach((client, index) =>
        rows.push([
            <span key={index} className="text-2xl font-bold">
                {client.category?.short_name + client.number}
            </span>,
            <span key={index} className="text-lg text-gray-1">
                {client.category?.name}
            </span>,
            <span key={index} className="text-base">
                {new Date(client.creation_date).toLocaleTimeString("pl-PL")}
                <br />
                <span className="text-gray-1">
                    {new Date(client.creation_date).toLocaleDateString("en-EN", {
                        hour12: false,
                    })}
                </span>
            </span>,
            <span key={index} className="flex flex-grow flex-wrap-reverse justify-center">
                <Button
                    onClick={() => deleteClient.mutate(client)}
                    color="red"
                    className="flex items-center"
                >
                    <span className="mr-2">Delete</span>
                    <RejectIcon />
                </Button>
                <Button
                    onClick={() => clientInService.mutate(client)}
                    color="green"
                    className="flex items-center"
                >
                    <span className="mr-2">Choose</span>
                    <AcceptIcon />
                </Button>
            </span>,
        ]),
    );

    return <Table columns={columns} rows={rows} />;
}
