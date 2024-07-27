import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    readonly accessTokenExpirationTime = "5m";
    readonly refreshTokenExpirationTime = "7d";

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findOne(username);

        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            user,
            access_token: await this.jwtService.signAsync(payload, {
                expiresIn: this.accessTokenExpirationTime,
                secret: process.env.JWT_SECRET_KEY,
            }),
            refresh_token: await this.jwtService.signAsync(payload, {
                expiresIn: this.refreshTokenExpirationTime,
                secret: process.env.JWT_REFRESH_TOKEN_KEY,
            }),
        };
    }

    async refresh(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: await this.jwtService.signAsync(payload, {
                expiresIn: this.accessTokenExpirationTime,
                secret: process.env.JWT_SECRET_KEY,
            }),
            refresh_token: await this.jwtService.signAsync(payload, {
                expiresIn: this.refreshTokenExpirationTime,
                secret: process.env.JWT_REFRESH_TOKEN_KEY,
            }),
        };
    }
}
