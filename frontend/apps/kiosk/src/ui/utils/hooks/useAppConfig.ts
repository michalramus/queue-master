import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

export function useAppConfig(
    options?: Omit<UseQueryOptions<AppConfigInterface, Error>, "queryKey" | "queryFn">,
): UseQueryResult<AppConfigInterface, Error> {
    return useQuery({
        queryKey: ["appConfig"],
        queryFn: () => window.electronAPI.getAppConfig(),
        ...options,
    });
}
