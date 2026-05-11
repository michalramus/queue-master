import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { getDevices, DeviceResponseDto } from "../api/devices";
import { AxiosAuthInstance } from "../axiosInstances.interface";

export function useDevices(
    axiosAuthInstance: AxiosAuthInstance,
    options?: Omit<UseQueryOptions<DeviceResponseDto[], Error>, "queryKey" | "queryFn">,
): UseQueryResult<DeviceResponseDto[], Error> {
    return useQuery({
        queryKey: ["devices"],
        queryFn: () => getDevices(axiosAuthInstance),
        ...options,
    });
}
