"use client";

import { useQuery } from "@tanstack/react-query";
import NumberGetterButton from "./NumberGetterButton";
import useGlobalSettings from "@/utils/providers/GlobalSettingsProvider";
import { useTranslations } from "next-intl";
import { MarkdownToHtml } from "shared-components";
import { CategoryInterface, getCategories } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";

export default function CategoriesForm({
    prefetchCategories,
}: {
    prefetchCategories: CategoryInterface[];
}) {
    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(axiosAuthInstance),
        initialData: prefetchCategories,
    });

    const globalSettings = useGlobalSettings();
    const t = useTranslations();

    return (
        <div className="mt-10 flex w-full flex-col items-center">
            <p className="text-text-2 mb-5 text-4xl">{t("choose_category")}</p>
            <MarkdownToHtml className="mb-5" markdown={globalSettings.kiosk_markdown} />

            {Array.isArray(categories) &&
                categories?.map((category: CategoryInterface) => {
                    return <NumberGetterButton key={category.id} category={category} />;
                })}
        </div>
    );
}
