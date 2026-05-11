import { IsArray, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetUserSettingsDto {
    @ApiProperty({
        description: "Array of setting keys to reset. If empty or not provided, all settings will be reset.",
        example: ["desk", "notifications"],
        type: [String],
        required: false,
    })
    @IsArray()
    @IsString({ each: true })
    settings?: string[];
}
