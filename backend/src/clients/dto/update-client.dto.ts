import { IsString, IsNotEmpty, IsInt } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

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
