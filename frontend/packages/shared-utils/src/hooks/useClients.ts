import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { getClients, ClientInterface } from "../api/clients";
import { AxiosAuthInstance } from "../axiosInstances.interface";

//TODO: Only fetch clients - do filtering within the components

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
    desk: number | undefined,
    options?: Omit<UseQueryOptions<ClientInterface[], Error>, "queryKey" | "queryFn">,
): UseQueryResult<ClientInterface[], Error> {
    return useQuery({
        queryKey: ["inServiceClients", desk],
        queryFn: () =>
            getClients(axiosAuthInstance).then((res) =>
                res.filter((client) => client.status === "InService" && client.desk === desk),
            ),
        enabled: desk !== undefined,
        ...options,
    });
}
