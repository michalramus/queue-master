import { UserRole } from "@prisma/client";

export class User {
    id: number;

    username: string;

    password: string;

    role: UserRole;
}
