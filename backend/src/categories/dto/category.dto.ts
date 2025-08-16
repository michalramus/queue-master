import { ApiProperty } from "@nestjs/swagger";
import { Category_Short_Name } from "@prisma/client";
import { IsNotEmpty, IsEnum, IsObject, IsOptional } from "class-validator";

export class CategoryCreateDto {
    @ApiProperty({
        description: "Category short name",
        enum: Category_Short_Name,
        example: "A",
    })
    @IsEnum(Category_Short_Name)
    short_name: Category_Short_Name;

    @ApiProperty({
        description: "Multilingual category names",
        example: { en: "Category A", pl: "Kategoria A" },
    })
    @IsObject()
    @IsNotEmpty()
    name: { [lang: string]: string };
}

export class CategoryUpdateDto {
    @ApiProperty({
        description: "Category short name",
        enum: Category_Short_Name,
        example: "A",
        required: false,
    })
    @IsEnum(Category_Short_Name)
    @IsOptional()
    short_name?: Category_Short_Name;

    @ApiProperty({
        description: "Multilingual category names",
        example: { en: "Updated Category A", pl: "Zaktualizowana Kategoria A" },
        required: false,
    })
    @IsObject()
    @IsOptional()
    name?: { [lang: string]: string };
}

export class CategoryResponseDto {
    @ApiProperty({ description: "Category ID", example: 1 })
    id: number;

    @ApiProperty({ description: "Category short name", example: "A" })
    short_name: string;

    @ApiProperty({
        description: "Multilingual category name dictionary",
        example: { en: "Category A", pl: "Kategoria A" },
    })
    name: { [lang: string]: string }; // MultilingualText
}
