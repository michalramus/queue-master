"use client";

import React, { ReactNode, useState } from "react";
import { ClientInterface, removeClient, setClientAsInService } from "@/utils/api/CSR/clients";
import { useMutation } from "@tanstack/react-query";
import Table from "@/components/Table";
import Button from "@/components/Buttons/Button";
import AcceptIcon from "../../components/svg/AcceptIcon";
import RejectIcon from "@/components/svg/RejectIcon";
import DeleteNumberModal from "./DeleteNumberModal";
import ChooseNumberModal from "./ChooseNumberModal";
import { useLocale, useTranslations } from "next-intl";

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
    const t = useTranslations();
    const locale = useLocale();

    const [deleteNumberModalHidden, setDeleteNumberModalHidden] = useState(true);
    const [clientToDelete, setClientToDelete] = useState<ClientInterface | null>(null);

    const [chooseNumberModalHidden, setChooseNumberModalHidden] = useState(true);
    const [clientToChoose, setClientToChoose] = useState<ClientInterface | null>(null);
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

    const columns = [t("number"), t("category"), t("creation_date"), ""];
    const rows: (string | number | ReactNode | null)[][] = [];
    filteredClientNumbers?.forEach((client, index) =>
        rows.push([
            <span key={index} className="text-2xl font-bold">
                {client.category?.short_name + client.number}
            </span>,
            <span key={index} className="text-lg text-text-2">
                {client.category.name[locale] || client.category.short_name}
            </span>,
            <span key={index} className="text-base">
                {new Date(client.creation_date).toLocaleTimeString("pl-PL")}
                <br />
                <span className="text-text-2">
                    {new Date(client.creation_date).toLocaleDateString("en-EN", {
                        hour12: false,
                    })}
                </span>
            </span>,
            <span key={index} className="flex flex-grow flex-wrap-reverse justify-center">
                <Button
                    onClick={() => {
                        setClientToDelete(client);
                        setDeleteNumberModalHidden(false);
                    }}
                    color="red"
                    className="flex items-center"
                >
                    <span className="mr-2">{t("delete")}</span>
                    <RejectIcon />
                </Button>
                <Button
                    onClick={() => {
                        setClientToChoose(client);
                        setChooseNumberModalHidden(false);
                    }}
                    color="green"
                    className="flex items-center"
                >
                    <span className="mr-2">{t("choose")}</span>
                    <AcceptIcon />
                </Button>
            </span>,
        ]),
    );

    return (
        <div>
            <DeleteNumberModal
                number={
                    (clientToDelete?.category.short_name ?? "") + (clientToDelete?.number ?? "")
                }
                hidden={deleteNumberModalHidden}
                deleteHandler={() => {
                    deleteClient.mutate(clientToDelete!);
                    setDeleteNumberModalHidden(true);
                }}
                cancelHandler={() => {
                    setDeleteNumberModalHidden(true);
                }}
            />

            <ChooseNumberModal
                number={
                    (clientToChoose?.category.short_name ?? "") + (clientToChoose?.number ?? "")
                }
                hidden={chooseNumberModalHidden}
                chooseHandler={() => {
                    clientInService.mutate(clientToChoose!);
                    setChooseNumberModalHidden(true);
                }}
                cancelHandler={() => {
                    setChooseNumberModalHidden(true);
                }}
            />
            <Table columns={columns} rows={rows} />
        </div>
    );
}
