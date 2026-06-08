import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { getUsers, UserResponseDto } from "../api/users";
import { AxiosAuthInstance } from "../axiosInstances.interface";

export function useUsers(
    axiosAuthInstance: AxiosAuthInstance,
    options?: Omit<UseQueryOptions<UserResponseDto[], Error>, "queryKey" | "queryFn">,
): UseQueryResult<UserResponseDto[], Error> {
    return useQuery({
        queryKey: ["users"],
        queryFn: () => getUsers(axiosAuthInstance),
        ...options,
    });
}
