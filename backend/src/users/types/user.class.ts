import { UserRole } from "@prisma/client";
import { DeskResponseDto } from "src/desks/dto/desk.dto";

export class User {
    id: number;

    username: string;

    password: string;

    role: UserRole;

    default_desk?: DeskResponseDto | null;
}
