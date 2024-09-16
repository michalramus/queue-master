import * as clientsApi from "@/utils/api/CSR/clients";
import { Category } from "@/utils/api/CSR/categories";
import { useMutation } from "@tanstack/react-query";
import Button from "@/components/Buttons/Button";

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
        <Button
            onClick={() => {
                mutation.mutate({ categoryId: category.id });
            }}
            className="border-primary-1 !m-3 !p-6 !w-full !rounded-3xl !border-2 !text-3xl"
            color="secondary"
        >
            {category.name}
        </Button>
    );
}
