import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { LangCode } from "@prisma/client";
import { CategoryResponseDto } from "src/categories/dto/category.dto";
import { DeskResponseDto } from "src/desks/dto/desk.dto";

export class ClientCreateDto {
    @ApiProperty({
        description: "ID of the category for the client",
        example: 1,
        type: "number",
    })
    @IsNumber()
    @IsNotEmpty()
    categoryId: number;

    @ApiProperty({
        description: "Language code for the client ticket",
        enum: LangCode,
        example: LangCode.en,
    })
    @IsString()
    @IsNotEmpty()
    language: LangCode;
}

export class ClientUpdateDto {
    @ApiProperty({
        description: "Status of the client in queue",
        enum: ["Waiting", "InService"],
        example: "InService",
    })
    @IsString()
    @IsNotEmpty()
    status: "Waiting" | "InService";

    @ApiProperty({
        description: "Desk ID assigned to the client",
        example: 1,
        type: "integer",
    })
    @IsInt()
    desk_id: number;
}

export class ClientResponseDto {
    @ApiProperty({ description: "Client ID", example: 1 })
    id: number;

    @ApiProperty({ description: "Client number in queue", example: 42 })
    number: number;

    @ApiProperty({ description: "Category ID", example: 1 })
    category_id: number;

    @ApiProperty({ description: "Category information" })
    category: CategoryResponseDto; //name - multilingual text

    @ApiProperty({
        description: "Client status",
        enum: ["Waiting", "InService"],
        example: "Waiting",
    })
    status: "Waiting" | "InService";

    @ApiProperty({
        description: "Desk assigned to this client (if any)",
        example: { id: 1, desk_number: 1, desk_name: "Desk 1" },
        nullable: true,
    })
    desk: DeskResponseDto | null;

    @ApiProperty({
        description: "Language code for the client ticket",
        enum: LangCode,
        example: LangCode.en,
    })
    language: LangCode;

    @ApiProperty({
        description: "Creation date",
        example: "2024-08-14T10:30:00Z",
    })
    creation_date: Date;

    @ApiProperty({
        description:
            "Number of tickets waiting in the same category at the moment this ticket was created. " +
            "Available as the &queueLength placeholder in the printer ticket template.",
        example: 15,
        required: false,
    })
    queue_length?: number;
}
