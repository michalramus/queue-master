import NumberGetterButton from "./NumberGetterButton";

import { MarkdownToHtml } from "shared-components";
import { CategoryInterface, useGlobalSettings } from "shared-utils";
import { useTranslation } from "react-i18next";

import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";

export default function CategoriesForm({ categories }: { categories: CategoryInterface[] }) {
    const { data: globalSettings } = useGlobalSettings(axiosPureInstance);
    const { t } = useTranslation();

    let showCategoryShortName: boolean = true;

    if (categories.length < 2) {
        showCategoryShortName = false;
    } else {
        showCategoryShortName = true;
    }

    function getHeaderText() {
        if (categories.length > 1) {
            return t("choose_category");
        } else if (categories.length === 1) {
            return t("get_a_ticket");
        } else {
            return t("category_list_is_empty");
        }
    }

    return (
        <div className="mt-10 flex w-full flex-col items-center">
            <p className="text-text-2 mb-5 text-4xl">{getHeaderText()}</p>
            <MarkdownToHtml className="mb-5" markdown={globalSettings?.kiosk_markdown || ""} />

            {Array.isArray(categories) &&
                categories?.map((category: CategoryInterface) => {
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
