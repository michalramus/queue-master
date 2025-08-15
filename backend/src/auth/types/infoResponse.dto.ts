import { ApiProperty } from "@nestjs/swagger";

export class InfoResponseDto {
    @ApiProperty({ description: "ID", example: 1 })
    id: number;

    @ApiProperty({
        description: "Role",
        enum: ["Device", "User", "Admin"],
        example: "User",
    })
    role: "Device" | "User" | "Admin";

    @ApiProperty({
        description: "Username (only for User/Admin roles)",
        example: "john_doe",
        required: false,
    })
    username?: string;
}
