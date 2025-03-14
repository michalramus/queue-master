import NumberGetterButton from "./NumberGetterButton";
import useGlobalSettings from "@/utils/providers/GlobalSettingsProvider";

import { MarkdownToHtml } from "shared-components";
import { CategoryInterface } from "shared-utils";
import { useTranslation } from "react-i18next";

export default function CategoriesForm({ categories }: { categories: CategoryInterface[] }) {
    const globalSettings = useGlobalSettings();
    const { t } = useTranslation();

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
