import Header from "../../components/Header";
import { getCategoriesSSR } from "@/utils/api/SSR/categories";
import CategoriesForm from "./CategoriesForm";

export default async function KioskPage() {
    const categories = await getCategoriesSSR();

    return (
        <main className="flex min-h-screen flex-col items-center p-16">
            <Header />
            <CategoriesForm prefetchCategories={categories} />
        </main>
    );
}
