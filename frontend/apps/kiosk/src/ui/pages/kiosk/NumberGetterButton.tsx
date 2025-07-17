import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import useAppConfig from "@/utils/providers/AppConfigProvider";

import useGlobalSettings from "@/utils/providers/GlobalSettingsProvider";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "shared-components";
import { addClient, CategoryInterface } from "shared-utils";

export default function NumberGetterButton({ category }: { category: CategoryInterface }) {
    const { i18n, t } = useTranslation();
    const globalSettings = useGlobalSettings();
    const appConfig = useAppConfig();
    const locale = i18n.language;

    const printingTime = appConfig.printingScriptDelay || 5000;

    const [loadingPage, setLoadingPage] = useState(false);
    const [lastTicketString, setLastTicketString] = useState(""); //category.shortname+number

    // Create new client
    const mutation = useMutation({
        mutationFn: ({ categoryId }: { categoryId: number }) =>
            addClient(categoryId, axiosAuthInstance),
        onSuccess: async (data) => {
            if (data != null) {
                console.log("Client", data);

                setLoadingPage(true);
                setLastTicketString(data.category.short_name + data.number.toString());
                window.electronAPI.executePrintTicket(
                    data,
                    globalSettings.printing_ticket_template,
                );
                await new Promise((resolve) => setTimeout(resolve, printingTime));
                setLoadingPage(false);
            }
        },
    });

    //TODO More elegant printing screen

    return (
        <>
            <Modal hidden={!loadingPage}>
                <p className="mb-1.5 text-center text-4xl font-bold">{lastTicketString}</p>
                <p className="text-center text-xl">{t("printing")}</p>
            </Modal>
            <Button
                onClick={() => {
                    mutation.mutate({ categoryId: category.id });
                }}
                className="border-primary-1 m-3! w-9/12! rounded-3xl! border-2! p-6! text-3xl!"
                color="secondary"
            >
                {category.name[locale] || category.short_name}
            </Button>
        </>
    );
}
