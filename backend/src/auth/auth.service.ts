import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { DevicesService } from "../devices/devices.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly devicesService: DevicesService,
        private readonly jwtService: JwtService,
    ) {}

    readonly accessTokenExpirationTime = "5m";
    readonly refreshTokenExpirationTime = "90d";

    //--------------------------Devices-----------------------

    async RegisterDevice(headers: { "user-agent": string }) {
        const device = await this.devicesService.create(headers["user-agent"]);

        const payload = { sub: device.deviceId, type: "Device" };
        return {
            device,
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

    //--------------------------Users-----------------------
    async validateUser(username: string, password: string) {
        const user = await this.usersService.findOne(username);

        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async login(user: any) {
        const payload = { sub: user.userId, type: "User" };
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
        const payload = { sub: user.userId, type: user.type };

        // Check if user still exists
        if ((user.type == "User") && (!this.usersService.findOneById(user.userId)))
        {
            throw new UnauthorizedException;
        }
        else if (user.type == "Device" && (!this.devicesService.findOne(user.userId)))
        {
            throw new UnauthorizedException;
        }

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
