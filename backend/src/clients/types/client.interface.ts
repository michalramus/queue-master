import { ApiProperty } from "@nestjs/swagger";
import { Category } from "src/categories/types/category.interface";

export enum ClientStatus {
    Waiting = "Waiting",
    InService = "InService",
}

export class Client {
    @ApiProperty({ description: "Client ID", example: 1 })
    id: number;

    @ApiProperty({ description: "Client number in queue", example: 42 })
    number: number;

    @ApiProperty({ description: "Category ID", example: 1 })
    category_id: number;

    @ApiProperty({ description: "Category information" })
    category: Category; //name - multilingual text

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
