"use client";

import * as clientsApi from "@/api/clients";
import { Category } from "@/api/categories";
import { useMutation } from "@tanstack/react-query";

export default function NumberGetterButton({ category }: { category: Category }) {
    // Create new client
    const mutation = useMutation({
        mutationFn: ({ categoryId }: { categoryId: string }) => clientsApi.addClient(categoryId),
        onSuccess: (data) => {
            if (data != null) {
                alert(data.number);
            }
        },
    });

    return (
        <button
            onClick={() => {
                mutation.mutate({ categoryId: category.id });
            }}
            className="m-3 w-full rounded-full border-2 bg-white bg-opacity-5 p-6 text-center text-2xl hover:bg-opacity-15"
        >
            {category.name}
        </button>
    );
}
