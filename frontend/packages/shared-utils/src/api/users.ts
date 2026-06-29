import { AxiosAuthInstance } from "../axiosInstances.interface";
import { UserSettingsInterface } from "./userSettings";
import { DeskInterface } from "./desks";

export type UserRole = "User" | "Admin";

export interface UserResponseDto {
    id: number;
    username: string;
    role: UserRole;
    default_desk?: DeskInterface | null;
}

export interface UserCreateDto {
    username: string;
    password: string;
    role: UserRole;
    default_desk_id?: number;
    settings?: UserSettingsInterface;
}

export interface UserUpdateDto {
    username?: string;
    role?: UserRole;
    default_desk_id?: number | null;
}

export interface UserPasswordUpdateDto {
    password: string;
}

const apiPath = "/users";

export async function getUsers(axiosAuthInstance: AxiosAuthInstance): Promise<UserResponseDto[]> {
    const response = await axiosAuthInstance.auth.get(apiPath);
    return response.data;
}

export async function createUser(
    axiosAuthInstance: AxiosAuthInstance,
    userCreateDto: UserCreateDto,
): Promise<UserResponseDto> {
    const response = await axiosAuthInstance.auth.post(apiPath, userCreateDto);
    return response.data;
}

export async function updateUser(
    axiosAuthInstance: AxiosAuthInstance,
    userId: number,
    userUpdateDto: UserUpdateDto,
): Promise<UserResponseDto> {
    const response = await axiosAuthInstance.auth.patch(`${apiPath}/${userId}`, userUpdateDto);
    return response.data;
}

export async function updateUserPassword(
    axiosAuthInstance: AxiosAuthInstance,
    userId: number,
    userPasswordUpdateDto: UserPasswordUpdateDto,
): Promise<{ message: string }> {
    const response = await axiosAuthInstance.auth.patch(
        `${apiPath}/${userId}/password`,
        userPasswordUpdateDto,
    );
    return response.data;
}

export async function deleteUser(
    axiosAuthInstance: AxiosAuthInstance,
    userId: number,
): Promise<UserResponseDto> {
    const response = await axiosAuthInstance.auth.delete(`${apiPath}/${userId}`);
    return response.data;
}
