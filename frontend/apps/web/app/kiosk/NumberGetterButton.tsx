import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { useMutation } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { Button } from "shared-components";
import { addClient, CategoryInterface } from "shared-utils";

export default function NumberGetterButton({ category }: { category: CategoryInterface }) {
    const locale = useLocale();
    // Create new client
    const mutation = useMutation({
        mutationFn: ({ categoryId }: { categoryId: number }) =>
            addClient(categoryId, axiosAuthInstance),
        onSuccess: (data) => {
            if (data != null) {
                alert((data.category?.short_name ? data.category.short_name : "") + data.number);
            }
        },
    });

    return (
        <Button
            onClick={() => {
                mutation.mutate({ categoryId: category.id });
            }}
            className="border-primary-1 m-3! w-full! rounded-3xl! border-2! p-6! text-3xl!"
            color="secondary"
        >
            {category.name[locale] || category.short_name}
        </Button>
    );
}
