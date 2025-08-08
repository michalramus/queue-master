import { IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

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
