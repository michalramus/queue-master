import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { AuthInfoInterface, getInfo } from "../api/auth";
import { AxiosAuthInstance } from "../axiosInstances.interface";

export function useAuthInfo(
    axiosAuthInstance: AxiosAuthInstance,
    options?: Omit<UseQueryOptions<AuthInfoInterface, Error>, "queryKey" | "queryFn">,
): UseQueryResult<AuthInfoInterface, Error> {
    return useQuery({
        queryKey: ["authInfo"],
        queryFn: async () => {
            const response = await getInfo(axiosAuthInstance);
            return response.data;
        },
        retry: false,
        enabled: false, // Disabled by default
        ...options,
    });
}
