import { ApiProperty } from "@nestjs/swagger";

export class User {
    @ApiProperty({ description: "User ID", example: 1 })
    id: number;

    @ApiProperty({ description: "Username", example: "john_doe" })
    username: string;

    @ApiProperty({ description: "User password", example: "hashed_password" })
    password: string;

    @ApiProperty({
        description: "User role",
        enum: ["Device", "User", "Admin"],
        example: "User",
    })
    role: "Device" | "User" | "Admin";
}
