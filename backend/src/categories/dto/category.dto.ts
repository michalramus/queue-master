import { ApiProperty } from "@nestjs/swagger";
import { Category_Short_Name, LangCode } from "@prisma/client";
import {
    IsNotEmpty,
    IsEnum,
    IsObject,
    IsOptional,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    Validate,
} from "class-validator";

@ValidatorConstraint({ name: "isValidMultilingualText", async: false })
export class IsValidMultilingualText implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        if (!value || typeof value !== "object") {
            return false;
        }

        const providedLangs = Object.keys(value);

        // Validate that all provided languages are valid LangCodes with non-empty strings
        const validLangs = Object.values(LangCode);
        for (const lang of providedLangs) {
            if (!validLangs.includes(lang as LangCode)) {
                return false;
            }
            if (!value[lang] || typeof value[lang] !== "string" || value[lang].trim().length === 0) {
                return false;
            }
        }

        return true;
    }

    defaultMessage(): string {
        return (
            "Name must contain valid language with non-empty text. Valid languages: " +
            Object.values(LangCode).join(", ")
        );
    }
}

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
    @Validate(IsValidMultilingualText)
    name: { [lang in LangCode]?: string };
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
    @Validate(IsValidMultilingualText)
    name?: { [lang in LangCode]?: string };
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
    name: { [lang: string]: string }; //TODO: replace with LangCode
}
