"use client";

import Header from "@/components/Header";
import NumberGetterButton from "./NumberGetterButton";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/categories";
import { Category } from "@/api/categories";

export default function KioskPage() {
    const { data: categories, isLoading } = useQuery({ queryKey: ["categories"], queryFn: getCategories });

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <Header>Queue System</Header>

            <div className="mt-20 flex w-full flex-col items-center">
                {categories?.map((category: Category) => {
                    return <NumberGetterButton key={category.id} category={category} />;
                })}
            </div>
        </main>
    );
}
