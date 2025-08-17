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

    const printingTime = appConfig.printingDialogueShowTime || 5000;

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

    //TODO fix printing screen
    return (
        <>
            <Modal hidden={!loadingPage}>
                <div className="flex flex-col items-center justify-center p-8">
                    <div className="border-primary-1 mb-6 h-16 w-16 animate-spin rounded-full border-b-2"></div>
                    <p className="text-text-1 mb-4 text-center text-5xl font-bold">
                        {lastTicketString}
                    </p>
                    <p className="text-text-2 text-center text-2xl">{t("printing")}</p>
                    <div className="mt-4 flex space-x-1">
                        <div className="bg-primary-1 h-2 w-2 animate-bounce rounded-full"></div>
                        <div
                            className="bg-primary-1 h-2 w-2 animate-bounce rounded-full"
                            style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                            className="bg-primary-1 h-2 w-2 animate-bounce rounded-full"
                            style={{ animationDelay: "0.2s" }}
                        ></div>
                    </div>
                </div>
            </Modal>
            <Button
                onClick={() => {
                    mutation.mutate({ categoryId: category.id });
                }}
                className="border-primary-1 relative! m-3! flex! w-9/12! items-center! justify-center! rounded-3xl! border-2! p-6! text-3xl!"
                color="secondary"
            >
                {/* TODO: text-white class replace with custom class or left it to be ok */}
                <div className="absolute top-1/2 left-6 -translate-y-1/2 transform">
                    <span className="bg-primary-1 rounded-lg px-4 py-2 text-2xl font-bold text-white shadow-md">
                        {category.short_name}
                    </span>
                </div>
                <span className="text-center">{category.name[locale] || category.short_name}</span>
            </Button>
        </>
    );
}
