import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { getLogoAvailability, LogoID } from "../api/files";
import { AxiosPureInstance } from "../axiosInstances.interface";

export function useLogoAvailabilities(
    axiosPureInstance: AxiosPureInstance,
    options?: Omit<UseQueryOptions<LogoID[], Error>, "queryKey" | "queryFn">,
): UseQueryResult<LogoID[], Error> {
    return useQuery({
        queryKey: ["logoAvailabilities"],
        queryFn: () => getLogoAvailability(axiosPureInstance),
        ...options,
    });
}
