import { ApiProperty } from "@nestjs/swagger";
import { LogoID } from "../types/logoID.enum";
import { LangCode } from "@prisma/client";

export class LogoAvailabilityResponseDto {
    @ApiProperty({
        description: "Map of language code to available logo IDs",
        example: { en: ["logo_kiosk_main", "logo_tv_main"], pl: [] },
        type: "object",
        additionalProperties: {
            type: "array",
            items: { type: "string", enum: Object.values(LogoID) },
        },
    })
    availableLogos: Record<LangCode, LogoID[]>;
}
