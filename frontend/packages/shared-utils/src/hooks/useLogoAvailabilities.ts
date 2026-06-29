import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { getLogoAvailability, LogoID } from "../api/files";
import { AxiosPureInstance } from "../axiosInstances.interface";
import { LangCode } from "../types/LangCode";

export function useLogoAvailabilities(
    axiosPureInstance: AxiosPureInstance,
    options?: Omit<UseQueryOptions<Record<LangCode, LogoID[]>, Error>, "queryKey" | "queryFn">,
): UseQueryResult<Record<LangCode, LogoID[]>, Error> {
    return useQuery({
        queryKey: ["logoAvailabilities"],
        queryFn: () => getLogoAvailability(axiosPureInstance),
        ...options,
    });
}
