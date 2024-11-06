import Header from "../../components/Header";
import { getCategoriesSSR } from "@/utils/api/SSR/categories";
import CategoriesForm from "./CategoriesForm";
import { getGlobalSettingsSSR } from "@/utils/api/SSR/settings";

export default async function KioskPage() {
    const categories = await getCategoriesSSR();
    const globalSettings = await getGlobalSettingsSSR();
    return (
        <main className="flex min-h-screen flex-col items-center p-16">
            <Header />
            <CategoriesForm
                prefetchGlobalSettings={globalSettings}
                prefetchCategories={categories}
            />
        </main>
    );
}
