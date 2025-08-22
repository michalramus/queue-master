import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";

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
}
