import { ApiProperty } from "@nestjs/swagger";

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
