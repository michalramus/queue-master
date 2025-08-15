import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponseDto {
    @ApiProperty({ description: "Category ID", example: 1 })
    id: number;

    @ApiProperty({ description: "Category short name", example: "A" })
    short_name: string;

    @ApiProperty({
        description: "Multilingual category name dictionary",
        example: { en: "Cat1", pl: "Kat1" },
    })
    name: { [lang: string]: string }; // MultilingualText
}
