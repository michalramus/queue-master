import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { DeskInterface, getDesk, getDesks } from "../api/desks";
import { AxiosAuthInstance } from "../axiosInstances.interface";

export function useDesks(
    axiosAuthInstance: AxiosAuthInstance,
    options?: Omit<UseQueryOptions<DeskInterface[], Error>, "queryKey" | "queryFn">,
): UseQueryResult<DeskInterface[], Error> {
    return useQuery({
        queryKey: ["desks"],
        queryFn: () => getDesks(axiosAuthInstance),
        ...options,
    });
}

export function useDesk(
    axiosAuthInstance: AxiosAuthInstance,
    id: number | undefined,
    options?: Omit<UseQueryOptions<DeskInterface, Error>, "queryKey" | "queryFn">,
): UseQueryResult<DeskInterface, Error> {
    return useQuery({
        queryKey: ["desk", id],
        queryFn: () => getDesk(axiosAuthInstance, id!),
        enabled: id !== undefined,
        ...options,
    });
}
