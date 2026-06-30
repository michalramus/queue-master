"use client";

import React, { ReactNode, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AcceptIcon, Button, ConfirmModal, RejectIcon, Table } from "shared-components";

import { useLocale, useTranslations } from "next-intl";
import { ClientInterface, removeClient, setClientAsInService, LangCode } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import Image from "next/image";
import plFlag from "flag-icons/flags/4x3/pl.svg";
import gbFlag from "flag-icons/flags/4x3/gb.svg";

/**
 * Table with clients waiting for service
 * @component
 */
export default function ClientTable({
    filteredClientNumbers,
    deskId,
}: {
    filteredClientNumbers: ClientInterface[] | undefined;
    deskId: number;
}) {
    const t = useTranslations();
    const locale = useLocale();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<ClientInterface | null>(null);

    const [chooseModalOpen, setChooseModalOpen] = useState(false);
    const [clientToChoose, setClientToChoose] = useState<ClientInterface | null>(null);
    //----------------------------------------
    //Api calls

    // set client as in service
    const clientInService = useMutation({
        mutationFn: (clientNumber: ClientInterface) =>
            setClientAsInService(clientNumber, deskId, axiosAuthInstance),
    });

    // remove client
    const deleteClient = useMutation({
        mutationFn: (clientNumber: ClientInterface) =>
            removeClient(clientNumber, axiosAuthInstance),
    });
    //----------------------------------------

    const handleDeleteClick = (client: ClientInterface) => {
        setClientToDelete(client);
        setDeleteModalOpen(true);
    };

    const handleChooseClick = (client: ClientInterface) => {
        setClientToChoose(client);
        setChooseModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        deleteClient.mutate(clientToDelete!);
        setDeleteModalOpen(false);
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
    };

    const handleChooseConfirm = () => {
        clientInService.mutate(clientToChoose!);
        setChooseModalOpen(false);
    };

    const handleChooseCancel = () => {
        setChooseModalOpen(false);
    };

    const columns = [t("number"), t("category"), t("language"), t("creation_date"), ""];
    const rows: (string | number | ReactNode | null)[][] = [];
    filteredClientNumbers?.forEach((client, index) =>
        rows.push([
            <span key={index} className="text-lg font-bold sm:text-xl lg:text-2xl">
                {client.category?.short_name + client.number}
            </span>,
            <span key={index} className="text-text-2 text-sm sm:text-base lg:text-lg">
                {client.category.name[locale as LangCode] || client.category.short_name}
            </span>,
            <span key={index} className="flex items-center justify-center">
                <Image
                    src={client.language === LangCode.pl ? plFlag : gbFlag}
                    alt={client.language.toUpperCase()}
                    width={64}
                    height={48}
                    className="rounded border border-gray-300"
                />
            </span>,
            <span key={index} className="text-xs sm:text-sm lg:text-base">
                {new Date(client.creation_date).toLocaleTimeString("pl-PL")}
                <br />
                <span className="text-text-2">
                    {new Date(client.creation_date).toISOString().split("T")[0]}
                </span>
            </span>,
            <span
                key={index}
                className="flex flex-col-reverse items-center sm:flex-row sm:flex-wrap-reverse sm:justify-center"
            >
                <Button
                    onClick={() => handleDeleteClick(client)}
                    color="red"
                    className="flex items-center"
                >
                    <span className="mr-2 hidden sm:inline">{t("delete")}</span>
                    <RejectIcon />
                </Button>
                <Button
                    onClick={() => handleChooseClick(client)}
                    color="green"
                    className="flex items-center"
                >
                    <span className="mr-2 hidden sm:inline">{t("choose")}</span>
                    <AcceptIcon />
                </Button>
            </span>,
        ]),
    );

    return (
        <>
            <ConfirmModal
                isOpen={deleteModalOpen}
                title={`${clientToDelete?.category.short_name ?? ""}${clientToDelete?.number ?? ""}`}
                message={t("are_you_sure_delete_ticket")}
                confirmText={t("delete")}
                cancelText={t("cancel")}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                type="danger"
            />

            <ConfirmModal
                isOpen={chooseModalOpen}
                title={`${clientToChoose?.category.short_name ?? ""}${clientToChoose?.number ?? ""}`}
                message={t("are_you_sure_choose_ticket")}
                confirmText={t("choose")}
                cancelText={t("cancel")}
                onConfirm={handleChooseConfirm}
                onCancel={handleChooseCancel}
                type="primary"
            />
            <Table columns={columns} rows={rows} />
        </>
    );
}
