import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { useAppConfig } from "@/utils/hooks/useAppConfig";

import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "shared-components";
import {
    addClient,
    CategoryInterface,
    useGlobalSettings,
    useMultilingualSettings,
    LangCode,
} from "shared-utils";

export default function NumberGetterButton({
    category,
    showCategoryShortName,
}: {
    category: CategoryInterface;
    showCategoryShortName: boolean;
}) {
    const { i18n, t } = useTranslation();
    const { data: globalSettings } = useGlobalSettings(axiosPureInstance);
    const { data: multilingualSettings } = useMultilingualSettings(axiosPureInstance);
    const { data: appConfig } = useAppConfig();
    const locale: LangCode = i18n.language as LangCode;

    const printingTime = appConfig?.printingDialogueShowTime || 5000;

    const [loadingPage, setLoadingPage] = useState(false);
    const [lastTicketString, setLastTicketString] = useState(""); //category.shortname+number

    const defaultLanguage = globalSettings?.locale || "en";

    // Reset language to default when printing dialog closes
    useEffect(() => {
        if (!loadingPage && lastTicketString) {
            // Dialog just closed, reset language
            i18n.changeLanguage(defaultLanguage);
        }
    }, [loadingPage, lastTicketString, i18n, defaultLanguage]);

    //TODO: Add loading when waiting for ticket
    // Create new client
    const mutation = useMutation({
        mutationFn: ({ categoryId, language }: { categoryId: number; language: LangCode }) =>
            addClient(categoryId, language, axiosAuthInstance),
        onSuccess: async (data) => {
            if (data != null) {
                console.log("Client", data);

                setLoadingPage(true);
                setLastTicketString(
                    (showCategoryShortName ? data.category.short_name : "") +
                        data.number.toString(),
                );

                // Get the ticket template for the current language
                const ticketTemplate =
                    multilingualSettings?.printing_ticket_template?.[locale] ||
                    "Specify ticket template in settings for language " + locale;

                window.electronAPI.executePrintTicket(data, ticketTemplate);
                await new Promise((resolve) => setTimeout(resolve, printingTime));
                setLoadingPage(false);
            }
        },
    });

    const handleButtonClick = () => {
        if (category.id !== undefined) {
            mutation.mutate({
                categoryId: category.id,
                language: locale as LangCode,
            });
        }
    };

    //TODO fix printing screen - block button for 0,5s after clicked
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
                onClick={handleButtonClick}
                className="border-primary-1 relative! m-3! flex! w-9/12! items-center! justify-center! rounded-3xl! border-2! p-6! text-3xl!"
                color="secondary"
            >
                {/* TODO: text-white class replace with custom class or left it to be ok */}
                {showCategoryShortName && (
                    <div className="absolute top-1/2 left-6 -translate-y-1/2 transform">
                        <span className="bg-primary-1 rounded-lg px-4 py-2 text-2xl font-bold text-white shadow-md">
                            {category.short_name}
                        </span>
                    </div>
                )}
                <span className="text-center">
                    {category.name[locale as keyof typeof category.name] || category.short_name}
                </span>
            </Button>
        </>
    );
}
