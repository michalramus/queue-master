import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { DevicesService } from "../devices/devices.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { Entity } from "./types/entity.class";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly devicesService: DevicesService,
        private readonly jwtService: JwtService,
    ) {}

    readonly accessTokenExpirationTime = "5m";
    readonly refreshTokenExpirationTime = "90d";

    /**
     * Refresh token of device never expires
     * @param headers
     * @returns
     */
    async RegisterDevice(headers: { "user-agent": string }) {
        const device = await this.devicesService.create(headers["user-agent"]);

        const payload = { sub: device.deviceId, type: "Device" };
        return {
            device,
            access_token: await this.jwtService.signAsync(payload, {
                expiresIn: this.accessTokenExpirationTime,
                secret: process.env.JWT_SECRET_KEY,
            }),
            //Refresh token never expires
            refresh_token: await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_TOKEN_KEY,
            }),
        };
    }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.validateUser(loginUserDto.username, loginUserDto.password);

        if (!user) {
            throw new UnauthorizedException("Incorrect username or password");
        }

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

    async refresh(entity: Entity) {
        const payload = entity.getJwtPayload();

        // Check if entity still exists
        if (entity.type == "User" && !(await this.usersService.findOneById(entity.id))) {
            throw new UnauthorizedException();
        } else if (entity.type == "Device" && !(await this.devicesService.findOne(entity.id)).accepted) {
            throw new UnauthorizedException();
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

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findOneByUsername(username);

        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async validateRoles(roles: ("Device" | "User" | "Admin")[], entity: Entity): Promise<boolean> {
        switch (entity.type) {
            case "User":
                const user = await this.usersService.findOneById(entity.id);
                if (roles.includes(user.role)) {
                    return true;
                }

                break;
            case "Device":
                const device = await this.devicesService.findOne(entity.id);

                if (roles.includes("Device") && device.accepted) {
                    return true;
                }

                break;
        }
        return false;
    }
}
