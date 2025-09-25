import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { getClients, ClientInterface } from "../api/clients";
import { AxiosAuthInstance } from "../axiosInstances.interface";

export function useWaitingClients(
    axiosAuthInstance: AxiosAuthInstance,
    options?: Omit<UseQueryOptions<ClientInterface[], Error>, "queryKey" | "queryFn">,
): UseQueryResult<ClientInterface[], Error> {
    return useQuery({
        queryKey: ["waitingClients"],
        queryFn: () =>
            getClients(axiosAuthInstance).then((res) =>
                res.filter((client) => client.status === "Waiting"),
            ),
        ...options,
    });
}

export function useInServiceClients(
    axiosAuthInstance: AxiosAuthInstance,
    seat: number | undefined,
    options?: Omit<UseQueryOptions<ClientInterface[], Error>, "queryKey" | "queryFn">,
): UseQueryResult<ClientInterface[], Error> {
    return useQuery({
        queryKey: ["inServiceClients", seat],
        queryFn: () =>
            getClients(axiosAuthInstance).then((res) =>
                res.filter((client) => client.status === "InService" && client.seat === seat),
            ),
        enabled: seat !== undefined,
        ...options,
    });
}
