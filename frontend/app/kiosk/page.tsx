import Header from "../../components/Header";
import { getCategoriesSSR } from "@/utils/api/SSR/categories";
import CategoriesForm from "./CategoriesForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default async function KioskPage() {
    const categories = await getCategoriesSSR();

    return (
        <main className="flex min-h-screen flex-col items-center p-16">
            <LanguageSwitcher />
            <Header />
            <CategoriesForm prefetchCategories={categories} />
        </main>
    );
}
