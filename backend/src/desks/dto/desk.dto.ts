import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { CategoryResponseDto } from "src/categories/dto/category.dto";

export class DeskCreateDto {
    @ApiProperty({ description: "Unique desk number", example: 1 })
    @IsInt()
    @Min(1)
    desk_number: number;

    @ApiProperty({ description: "Unique desk name", example: "Desk 1" })
    @IsString()
    @IsNotEmpty()
    desk_name: string;
}

export class DeskUpdateDto {
    @ApiProperty({ description: "Unique desk number", example: 1, required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    desk_number?: number;

    @ApiProperty({ description: "Unique desk name", example: "Desk 1", required: false })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    desk_name?: string;
}

export class DeskCategoryDto {
    @ApiProperty({ description: "Category ID to assign", example: 1 })
    @IsInt()
    @Min(1)
    category_id: number;
}

export class DeskResponseDto {
    @ApiProperty({ description: "Desk ID", example: 1 })
    id: number;

    @ApiProperty({ description: "Desk number", example: 1 })
    desk_number: number;

    @ApiProperty({ description: "Desk name", example: "Desk 1" })
    desk_name: string;

    @ApiProperty({
        description: "Categories assigned to this desk",
        example: [{ id: 1, short_name: "A" }],
        required: false,
    })
    categories?: CategoryResponseDto[];
}
