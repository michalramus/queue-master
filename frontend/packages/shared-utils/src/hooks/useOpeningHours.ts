import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { getOpeningHours, OpeningHoursDto } from "../api/openingHours";
import { AxiosAuthInstance } from "../axiosInstances.interface";

export function useOpeningHours(
    axiosAuthInstance: AxiosAuthInstance,
    options?: Omit<UseQueryOptions<OpeningHoursDto[], Error>, "queryKey" | "queryFn">,
): UseQueryResult<OpeningHoursDto[], Error> {
    return useQuery({
        queryKey: ["openingHours"],
        queryFn: () => getOpeningHours(axiosAuthInstance),
        ...options,
    });
}
