import { IsString, IsNotEmpty } from "class-validator";

export class CreateClientDto {
    @IsString()
    @IsNotEmpty()
    categoryId: string;
}
