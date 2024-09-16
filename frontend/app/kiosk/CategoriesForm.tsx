"use client";

import { Category, getCategories } from "@/utils/api/CSR/categories";
import { useQuery } from "@tanstack/react-query";
import NumberGetterButton from "./NumberGetterButton";

export default function CategoriesForm({prefetchCategories}: {prefetchCategories: Category[]}) {
    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        initialData: prefetchCategories
    });

    return (
        <div className="mt-10 flex w-full flex-col items-center">
            <p className="mb-5 text-4xl text-gray-600">Choose category</p>
            {Array.isArray(categories) &&
                categories?.map((category: Category) => {
                    return <NumberGetterButton key={category.id} category={category} />;
                })}
        </div>
    );
}
