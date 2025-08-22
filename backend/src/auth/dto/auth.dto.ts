import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class DeviceRegistrationResponseDto {
    @ApiProperty({
        description: "Success message",
        example: "Device registered successfully",
    })
    message: string;

    @ApiProperty({
        description: "JWT token for device authentication",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    jwt_token: string;
}

export class AuthInfoResponseDto {
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

export class AuthLoginUserDto {
    @ApiProperty({
        description: "Username for authentication",
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: "Password for authentication",
        format: "password",
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
