"use client";

import NumberGetterButton from "./NumberGetterButton";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/utils/api/CSR/categories";
import { Category } from "@/utils/api/CSR/categories";
import Header from "../../components/Header";

export default function KioskPage() {
    const { data: categories, isLoading: isLoadingCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <Header>Queue System</Header>

            <div className="mt-20 flex w-full flex-col items-center">
                {isLoadingCategories && <p>Loading...</p>}
                {Array.isArray(categories) &&
                    categories?.map((category: Category) => {
                        return <NumberGetterButton key={category.id} category={category} />;
                    })}
            </div>
        </main>
    );
}
