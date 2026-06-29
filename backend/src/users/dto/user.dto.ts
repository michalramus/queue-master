import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MinLength, IsEnum, IsOptional, IsObject, IsInt, Min } from "class-validator";
import { UserRole } from "@prisma/client";
import { DeskResponseDto } from "src/desks/dto/desk.dto";

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

    @ApiProperty({ description: "Default desk ID (optional)", example: 1, required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    default_desk_id?: number;

    @ApiProperty({
        description: "Initial user settings (optional)",
        example: { notifications_on: true },
        required: false,
    })
    @IsOptional()
    @IsObject()
    settings?: { [key: string]: string | number };
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

    @ApiProperty({ description: "Default desk ID (null to unset)", example: 1, required: false, nullable: true })
    @IsOptional()
    @IsInt()
    @Min(1)
    default_desk_id?: number | null;
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

    @ApiProperty({
        description: "Default desk (if assigned)",
        type: () => DeskResponseDto,
        nullable: true,
    })
    default_desk: DeskResponseDto | null;
}
