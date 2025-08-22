// API methods for interacting with the backend opening-hours endpoints
import { AxiosAuthInstance } from "../axiosInstances.interface";

export enum DayOfWeek {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY",
}

export interface OpeningHoursDto {
    day_of_week: DayOfWeek;
    is_closed: boolean;
    open_time: string | null;
    close_time: string | null;
}

export interface CreateOpeningHoursDto {
    opening_hours: OpeningHoursDto[];
}

const apiPath = "/opening-hours";

export async function getOpeningHours(
    axiosAuthInstance: AxiosAuthInstance,
): Promise<OpeningHoursDto[]> {
    const response = await axiosAuthInstance.auth.get(apiPath);
    return response.data;
}

export async function setOpeningHours(
    openingHours: CreateOpeningHoursDto,
    axiosAuthInstance: AxiosAuthInstance,
) {
    const response = await axiosAuthInstance.auth.post(apiPath, openingHours);
    return response.data;
}
