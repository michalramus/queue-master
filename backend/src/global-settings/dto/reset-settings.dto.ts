import { IsArray, IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetGlobalSettingsDto {
    @ApiProperty({
        description: "Array of setting keys to reset. If empty or not provided, all settings will be reset.",
        example: ["color_primary_1", "color_primary_2", "color_background"],
        type: [String],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    settings?: string[];
}
