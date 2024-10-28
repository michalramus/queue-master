import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateClientDto {
    @IsNumber()
    @IsNotEmpty()
    categoryId: number;
}
