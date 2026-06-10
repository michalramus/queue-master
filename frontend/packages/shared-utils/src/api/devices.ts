import { AxiosAuthInstance } from "../axiosInstances.interface";

export interface DeviceResponseDto {
    id: number;
    accepted: boolean;
    comment?: string;
}

export interface DevicePatchDto {
    accepted?: boolean;
    comment?: string;
}

export interface DeviceCreateDto {
    comment?: string;
}

const apiPath = "/devices";

export async function registerDevice(axiosInstance: AxiosAuthInstance, comment?: string) {
    const response = await axiosInstance.auth.post(apiPath, { comment });

    return response;
}

export async function getDevices(
    axiosAuthInstance: AxiosAuthInstance,
): Promise<DeviceResponseDto[]> {
    const response = await axiosAuthInstance.auth.get(apiPath);
    return response.data;
}

export async function updateDevice(
    axiosAuthInstance: AxiosAuthInstance,
    deviceId: number,
    devicePatchDto: DevicePatchDto,
): Promise<DeviceResponseDto> {
    const response = await axiosAuthInstance.auth.patch(`${apiPath}/${deviceId}`, devicePatchDto);
    return response.data;
}

export async function deleteDevice(
    axiosAuthInstance: AxiosAuthInstance,
    deviceId: number,
): Promise<DeviceResponseDto> {
    const response = await axiosAuthInstance.auth.delete(`${apiPath}/${deviceId}`);
    return response.data;
}
