import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { getUserSettings, UserSettingsInterface } from "../api/userSettings";
import { AxiosAuthInstance } from "../axiosInstances.interface";

export function useUserSettings(
    axiosAuthInstance: AxiosAuthInstance,
    userId?: number,
    options?: Omit<UseQueryOptions<UserSettingsInterface, Error>, "queryKey" | "queryFn">,
): UseQueryResult<UserSettingsInterface, Error> {
    return useQuery({
        queryKey: userId ? ["userSettings", userId] : ["userSettings"],
        queryFn: () => getUserSettings(axiosAuthInstance, userId),
        retry: false,
        enabled: false, // Disabled by default
        ...options,
    });
}
