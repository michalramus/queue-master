import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { getCategories, CategoryInterface } from "../api/categories";
import { AxiosAuthInstance } from "../axiosInstances.interface";

export function useCategories(
    axiosAuthInstance: AxiosAuthInstance,
    options?: Omit<UseQueryOptions<CategoryInterface[], Error>, "queryKey" | "queryFn">,
): UseQueryResult<CategoryInterface[], Error> {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(axiosAuthInstance),
        // Copy before sorting — `sort` mutates in place and would rewrite the React Query cache
        select: (data) =>
            [...(data ?? [])].sort((a, b) => a.short_name.localeCompare(b.short_name)),
        ...options,
    });
}
