import { ApiProperty } from "@nestjs/swagger";

export class DeviceResponseDto {
    @ApiProperty({ description: "Device ID", example: 1 })
    id: number;

    @ApiProperty({ description: "Device acceptance status (if false - device is disabled)", example: true })
    accepted: boolean;
}
