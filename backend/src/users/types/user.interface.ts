export interface User {
    id: number;
    username: string;
    password: string;
    role: "Device" | "User" | "Admin";
}
