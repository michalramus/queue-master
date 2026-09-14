import NumberGetterButton from "./NumberGetterButton";

import { MarkdownToHtml } from "shared-components";
import { CategoryInterface, useGlobalSettings } from "shared-utils";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";

export default function CategoriesForm({ categories }: { categories: CategoryInterface[] }) {
    const { data: globalSettings } = useGlobalSettings(axiosPureInstance);
    const { t } = useTranslation();

    // Disabled categories are still shipped by the backend, but clients must not see them
    const enabledCategories: CategoryInterface[] = useMemo(
        () =>
            Array.isArray(categories) ? categories.filter((category) => category.is_enabled) : [],
        [categories],
    );

    let showCategoryShortName: boolean = true;

    if (enabledCategories.length < 2) {
        showCategoryShortName = false;
    } else {
        showCategoryShortName = true;
    }

    function getHeaderText() {
        if (enabledCategories.length > 1) {
            return t("choose_category");
        } else if (enabledCategories.length === 1) {
            return t("get_a_ticket");
        } else {
            return t("category_list_is_empty");
        }
    }

    return (
        <div className="mt-10 flex w-full flex-col items-center">
            <p className="text-text-2 mb-5 text-4xl">{getHeaderText()}</p>
            <MarkdownToHtml className="mb-5" markdown={globalSettings?.kiosk_markdown || ""} />

            {enabledCategories.map((category: CategoryInterface) => {
                return (
                    <NumberGetterButton
                        key={category.id}
                        category={category}
                        showCategoryShortName={showCategoryShortName}
                    />
                );
            })}
        </div>
    );
}
