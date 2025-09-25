import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { getGlobalSettings, GlobalSettingsInterface } from "../api/settings";
import { AxiosPureInstance } from "../axiosInstances.interface";

export function useGlobalSettings(
    axiosPureInstance: AxiosPureInstance,
    options?: Omit<UseQueryOptions<GlobalSettingsInterface, Error>, "queryKey" | "queryFn">,
): UseQueryResult<GlobalSettingsInterface, Error> {
    return useQuery({
        queryKey: ["globalSettings"],
        queryFn: () => getGlobalSettings(axiosPureInstance),
        retry: true,
        ...options,
    });
}
