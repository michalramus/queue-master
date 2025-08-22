import { ApiProperty } from "@nestjs/swagger";
import { LogoID } from "../types/logoID.enum";

export class LogoAvailabilityResponseDto {
    @ApiProperty({
        description: "List of available logo IDs",
        enum: LogoID,
        isArray: true,
        example: ["logo_kiosk_main", "logo_tv_main"],
    })
    availableLogos: LogoID[];
}
