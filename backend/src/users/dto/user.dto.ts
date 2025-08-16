import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MinLength, IsEnum, IsOptional } from "class-validator";
import { UserRole } from "@prisma/client";

export class UserCreateDto {
    @ApiProperty({ description: "Username", example: "john_doe" })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ description: "User password", example: "password123", minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({
        description: "User role",
        enum: UserRole,
        example: "User",
    })
    @IsEnum(UserRole)
    role: UserRole;
}

export class UserUpdateDto {
    @ApiProperty({
        description: "Username",
        example: "john_doe_updated",
        required: false,
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    username?: string;

    @ApiProperty({
        description: "User role",
        enum: UserRole,
        example: "User",
        required: false,
    })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}

export class UserPasswordUpdateDto {
    @ApiProperty({ description: "New password", example: "newpassword123", minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

export class UserResponseDto {
    @ApiProperty({ description: "User ID", example: 1 })
    id: number;

    @ApiProperty({ description: "Username", example: "john_doe" })
    username: string;

    @ApiProperty({
        description: "User role",
        enum: UserRole,
        example: "User",
    })
    role: UserRole;
}
