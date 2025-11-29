import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { getMultilingualSettings, MultilingualSettingsInterface } from "../api/settings";
import { AxiosPureInstance } from "../axiosInstances.interface";

export function useMultilingualSettings(
    axiosPureInstance: AxiosPureInstance,
    options?: Omit<UseQueryOptions<MultilingualSettingsInterface, Error>, "queryKey" | "queryFn">,
): UseQueryResult<MultilingualSettingsInterface, Error> {
    return useQuery({
        queryKey: ["multilingualSettings"],
        queryFn: () => getMultilingualSettings(axiosPureInstance),
        retry: true,
        ...options,
    });
}
