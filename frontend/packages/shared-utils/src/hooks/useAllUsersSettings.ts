import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { getAllUsersSettings, UserSettingsInterface } from "../api/userSettings";
import { AxiosAuthInstance } from "../axiosInstances.interface";

export function useAllUsersSettings(
    axiosAuthInstance: AxiosAuthInstance,
    options?: Omit<
        UseQueryOptions<{ [userId: number]: UserSettingsInterface }, Error>,
        "queryKey" | "queryFn"
    >,
): UseQueryResult<{ [userId: number]: UserSettingsInterface }, Error> {
    return useQuery({
        queryKey: ["allUsersSettings"],
        queryFn: () => getAllUsersSettings(axiosAuthInstance),
        ...options,
    });
}
