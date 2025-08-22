import { IsEnum, IsString, Matches, IsArray, ValidateNested, IsOptional, IsBoolean } from "class-validator";
import { Type } from "class-transformer";
import { DayOfWeek } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class OpeningHoursDto {
    @ApiProperty({ enum: DayOfWeek, description: "Day of the week" })
    @IsEnum(DayOfWeek)
    day_of_week: DayOfWeek;

    @ApiProperty({
        description: "Whether this day is closed for business",
        default: false,
    })
    @IsBoolean()
    is_closed: boolean;

    @ApiProperty({
        description: "Opening time in HH:mm format, required when not closed",
        example: "09:00",
        nullable: true,
        required: false,
    })
    @IsOptional()
    @IsString()
    @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "open_time must be in HH:mm format (e.g., 09:00)",
    })
    open_time: string | null;

    @ApiProperty({
        description: "Closing time in HH:mm format, required when not closed",
        example: "17:00",
        nullable: true,
        required: false,
    })
    @IsOptional()
    @IsString()
    @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "close_time must be in HH:mm format (e.g., 17:00)",
    })
    close_time: string | null;
}

export class CreateOpeningHoursDto {
    @ApiProperty({ type: [OpeningHoursDto], description: "Array of opening hours for multiple days" })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OpeningHoursDto)
    opening_hours: OpeningHoursDto[];
}
