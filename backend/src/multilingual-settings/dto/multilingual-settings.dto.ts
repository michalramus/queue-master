import { ApiProperty } from "@nestjs/swagger";
import { LangCode } from "@prisma/client";
import { IsObject, IsOptional } from "class-validator";

export class MultilingualSettingsDto {
    @ApiProperty({
        description:
            "Printing ticket template with translations for each language. Only specify languages you want to update. Supports HTML formatting with placeholders: &categoryShortName, &number, &date, &time, &queueLength (number of tickets waiting in the same category when this ticket was created). Set to null or empty string to delete/reset a specific language setting.",
        example: {
            en: '<div style="text-align:center;font-family:Helvetica"><p style="font-size:12px;font-weight:bold;margin-bottom:1px">Your Brand</p><p style="font-size:28px;font-weight:bold">&categoryShortName&number</p><p style="font-size:9px">&date &time</p></div>',
        },
        type: "object",
        additionalProperties: {
            type: "string",
            nullable: true,
        },
    })
    @IsObject()
    @IsOptional()
    printing_ticket_template?: { [lang in LangCode]: string | null };

    @IsObject()
    @IsOptional()
    monday_label?: { [lang in LangCode]: string | null };

    @IsObject()
    @IsOptional()
    tuesday_label?: { [lang in LangCode]: string | null };

    @IsObject()
    @IsOptional()
    wednesday_label?: { [lang in LangCode]: string | null };

    @IsObject()
    @IsOptional()
    thursday_label?: { [lang in LangCode]: string | null };

    @IsObject()
    @IsOptional()
    friday_label?: { [lang in LangCode]: string | null };

    @IsObject()
    @IsOptional()
    saturday_label?: { [lang in LangCode]: string | null };

    @IsObject()
    @IsOptional()
    sunday_label?: { [lang in LangCode]: string | null };
}
