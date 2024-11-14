"use client";

import { CategoryInterface, getCategories } from "@/utils/api/CSR/categories";
import { useQuery } from "@tanstack/react-query";
import NumberGetterButton from "./NumberGetterButton";
import MarkdownToHtml from "@/components/utils/MarkdownToHtml";

import useGlobalSettings from "@/utils/providers/GlobalSettingsProvider";

export default function CategoriesForm({
    prefetchCategories,
}: {
    prefetchCategories: CategoryInterface[];
}) {
    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        initialData: prefetchCategories,
    });

    const globalSettings = useGlobalSettings();

    return (
        <div className="mt-10 flex w-full flex-col items-center">
            <p className="mb-5 text-4xl text-text-2">Choose category</p>
            <MarkdownToHtml className="mb-5" markdown={globalSettings.kiosk_markdown} />

            {Array.isArray(categories) &&
                categories?.map((category: CategoryInterface) => {
                    return <NumberGetterButton key={category.id} category={category} />;
                })}
        </div>
    );
}
