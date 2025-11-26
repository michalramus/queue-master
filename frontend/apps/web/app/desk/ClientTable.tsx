"use client";

import React, { ReactNode, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import DeleteNumberModal from "./DeleteNumberModal";
import ChooseNumberModal from "./ChooseNumberModal";
import { useLocale, useTranslations } from "next-intl";
import { AcceptIcon, Button, RejectIcon, Table } from "shared-components";
import { ClientInterface, removeClient, setClientAsInService } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";

/**
 * Table with clients waiting for service
 * @param categoryIds - clients with these categories will be displayed
 * @component
 */
export default function ClientTable({
    clientNumbers,
    categoryIds,
    desk,
}: {
    clientNumbers: ClientInterface[] | undefined;
    categoryIds: number[];
    desk: number;
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
        mutationFn: (clientNumber: ClientInterface) =>
            setClientAsInService(clientNumber, desk, axiosAuthInstance),
    });

    // remove client
    const deleteClient = useMutation({
        mutationFn: (clientNumber: ClientInterface) =>
            removeClient(clientNumber, axiosAuthInstance),
    });
    //----------------------------------------

    //Prepare table content
    const filteredClientNumbers = clientNumbers?.filter(
        (client) => categoryIds.indexOf(client.category_id) != -1,
    );

    const handleDeleteClick = (client: ClientInterface) => {
        setClientToDelete(client);
        setDeleteNumberModalHidden(false);
    };

    const handleChooseClick = (client: ClientInterface) => {
        setClientToChoose(client);
        setChooseNumberModalHidden(false);
    };

    const handleDeleteConfirm = () => {
        deleteClient.mutate(clientToDelete!);
        setDeleteNumberModalHidden(true);
    };

    const handleDeleteCancel = () => {
        setDeleteNumberModalHidden(true);
    };

    const handleChooseConfirm = () => {
        clientInService.mutate(clientToChoose!);
        setChooseNumberModalHidden(true);
    };

    const handleChooseCancel = () => {
        setChooseNumberModalHidden(true);
    };

    const columns = [t("number"), t("category"), t("creation_date"), ""];
    const rows: (string | number | ReactNode | null)[][] = [];
    filteredClientNumbers?.forEach((client, index) =>
        rows.push([
            <span key={index} className="text-2xl font-bold">
                {client.category?.short_name + client.number}
            </span>,
            <span key={index} className="text-text-2 text-lg">
                {client.category.name[locale] || client.category.short_name}
            </span>,
            <span key={index} className="text-base">
                {new Date(client.creation_date).toLocaleTimeString("pl-PL")}
                <br />
                <span className="text-text-2">
                    {new Date(client.creation_date).toISOString().split("T")[0]}
                </span>
            </span>,
            <span key={index} className="flex grow flex-wrap-reverse justify-center">
                <Button
                    onClick={() => handleDeleteClick(client)}
                    color="red"
                    className="flex items-center"
                >
                    <span className="mr-2">{t("delete")}</span>
                    <RejectIcon />
                </Button>
                <Button
                    onClick={() => handleChooseClick(client)}
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
        <>
            <DeleteNumberModal
                number={
                    (clientToDelete?.category.short_name ?? "") + (clientToDelete?.number ?? "")
                }
                hidden={deleteNumberModalHidden}
                deleteHandler={handleDeleteConfirm}
                cancelHandler={handleDeleteCancel}
            />

            <ChooseNumberModal
                number={
                    (clientToChoose?.category.short_name ?? "") + (clientToChoose?.number ?? "")
                }
                hidden={chooseNumberModalHidden}
                chooseHandler={handleChooseConfirm}
                cancelHandler={handleChooseCancel}
            />
            <Table columns={columns} rows={rows} />
        </>
    );
}
