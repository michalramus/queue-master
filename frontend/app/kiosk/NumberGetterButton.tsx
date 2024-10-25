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
            className="!m-3 !w-full !rounded-3xl !border-2 border-primary-1 !p-6 !text-3xl"
            color="secondary"
        >
            {category.name}
        </Button>
    );
}
