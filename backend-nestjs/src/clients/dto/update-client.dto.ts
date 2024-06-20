import { IsString, IsNotEmpty, IsInt } from "class-validator";

export class UpdateClientDto {
    @IsString()
    @IsNotEmpty()
    status: "Waiting" | "InService";

    @IsInt()
    seat: number;
}
