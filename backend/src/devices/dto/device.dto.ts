import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class DeviceCreateDto {
    @ApiProperty({
        description: "Optional comment about the device",
        example: "Kiosk in reception area",
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    comment?: string;
}

export class DevicePatchDto {
    @ApiProperty({ description: "Device acceptance status", example: true })
    @IsNotEmpty()
    @IsBoolean()
    accepted: boolean;
}

export class DeviceResponseDto {
    @ApiProperty({ description: "Device ID", example: 1 })
    id: number;

    @ApiProperty({ description: "Device acceptance status (if false - device is disabled)", example: true })
    accepted: boolean;

    @ApiProperty({
        description: "Optional comment about the device",
        example: "Kiosk in reception area",
        required: false,
    })
    comment?: string;
}
