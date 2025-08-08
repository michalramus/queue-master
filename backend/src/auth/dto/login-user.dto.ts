import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
    @ApiProperty({
        description: "Username for authentication",
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: "Password for authentication",
        format: "password",
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
