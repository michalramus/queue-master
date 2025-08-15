import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CategoryResponseDto } from "src/categories/dto/category.dto";

export class CreateClientDto {
    @ApiProperty({
        description: "ID of the category for the client",
        example: 1,
        type: "number",
    })
    @IsNumber()
    @IsNotEmpty()
    categoryId: number;
}

export class UpdateClientDto {
    @ApiProperty({
        description: "Status of the client in queue",
        enum: ["Waiting", "InService"],
        example: "InService",
    })
    @IsString()
    @IsNotEmpty()
    status: "Waiting" | "InService";

    @ApiProperty({
        description: "Seat number assigned to the client",
        example: 5,
        type: "integer",
    })
    @IsInt()
    seat: number;
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
        description: "Seat number (if assigned)",
        example: 5,
        nullable: true,
    })
    seat: number | null;

    @ApiProperty({
        description: "Creation date",
        example: "2024-08-14T10:30:00Z",
    })
    creation_date: Date;

    @ApiProperty({
        description: "Queue length when client was added (if exists)",
        example: 15,
        required: false,
    })
    queue_length?: number;
}
