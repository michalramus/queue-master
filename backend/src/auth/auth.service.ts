import { ForbiddenException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { DevicesService } from "../devices/devices.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { Entity } from "./types/entity.class";
import { Response } from "express";
import { DatabaseService } from "src/database/database.service";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ms = require("ms"); //import syntax not working properly with this package

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly devicesService: DevicesService,
        private readonly jwtService: JwtService,
        private readonly databaseService: DatabaseService,
    ) {}

    private logger = new Logger(AuthService.name);

    readonly accessTokenExpirationTime = "1d";
    readonly refreshTokenExpirationTime = "90d";

    /**
     * Refresh token of device never expires
     * @param headers
     * @returns
     */
    async registerDevice(headers: { "user-agent": string }, ip: string, response: Response) {
        const device = await this.devicesService.create(headers["user-agent"]);

        this.logger.log(`Registered new device ${ip} ${JSON.stringify(device)}`);

        const payload = new Entity(device.id, "Device", `Device ${device.id}`).getJwtPayload();
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: this.accessTokenExpirationTime,
            secret: process.env.JWT_SECRET_KEY,
        });
        //Refresh token never expires
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_TOKEN_KEY,
        });

        response.cookie("jwt", accessToken, { httpOnly: true });
        response.cookie("jwt_refresh", refreshToken, { httpOnly: true });

        return "Device registered successfully ";
    }

    async login(loginUserDto: LoginUserDto, ip: string, response: Response) {
        const user = await this.validateUser(loginUserDto.username, loginUserDto.password);

        if (!user) {
            this.logger.warn(
                `UnauthorizedException: Failed attempt to log into "${loginUserDto.username}" account from ${ip} `,
            );
            throw new UnauthorizedException("Incorrect username or password");
        }

        this.logger.log(`[${loginUserDto.username}] Successful login`);
        const payload = new Entity(user.id, "User", user.username).getJwtPayload();
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: this.accessTokenExpirationTime,
            secret: process.env.JWT_SECRET_KEY,
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: this.refreshTokenExpirationTime,
            secret: process.env.JWT_REFRESH_TOKEN_KEY,
        });

        response.cookie("jwt", accessToken, { httpOnly: true });
        response.cookie("jwt_refresh", refreshToken, { httpOnly: true });

        response.cookie(
            "jwt_expiration_date",
            new Date(Date.now() + ms(this.accessTokenExpirationTime)).toUTCString(),
            {},
        );
        response.cookie(
            "jwt_refresh_expiration_date",
            new Date(Date.now() + ms(this.refreshTokenExpirationTime)).toUTCString(),
            {},
        );

        return "Successful login";
    }

    async refresh(entity: Entity, ip: string, response: Response) {
        const payload = entity.getJwtPayload();

        // Check if entity still exists
        if (entity.type == "User" && !(await this.usersService.findOneById(entity.id))) {
            this.logger.warn(
                `[${entity.type}: ${entity.id}] UnauthorizedException: Deleted user tried to retrieve new access token from ${ip}`,
            );
            throw new UnauthorizedException("User does not exist");
        }

        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: this.accessTokenExpirationTime,
            secret: process.env.JWT_SECRET_KEY,
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: this.refreshTokenExpirationTime,
            secret: process.env.JWT_REFRESH_TOKEN_KEY,
        });

        response.cookie("jwt", accessToken, { httpOnly: true });
        response.cookie("jwt_refresh", refreshToken, { httpOnly: true });

        response.cookie(
            "jwt_expiration_date",
            new Date(Date.now() + ms(this.accessTokenExpirationTime)).toUTCString(),
            {},
        );
        response.cookie(
            "jwt_refresh_expiration_date",
            new Date(Date.now() + ms(this.refreshTokenExpirationTime)).toUTCString(),
            {},
        );

        return "Successful token refresh";
    }

    async logout(entity: Entity, response: Response) {
        response.clearCookie("jwt", { httpOnly: true });
        response.clearCookie("jwt_refresh", { httpOnly: true });
        response.clearCookie("jwt_expiration_date", {});
        response.clearCookie("jwt_refresh_expiration_date", {});

        return "Logged out successfully";
    }

    async getInfo(entity: Entity) {
        if (entity.type == "Device") {
            const device = await this.databaseService.device.findUnique({ where: { id: entity.id } });
            return { id: device.id, role: "Device" };
        } else if (entity.type == "User") {
            const user = await this.databaseService.user.findUnique({ where: { id: entity.id } });
            return { id: user.id, username: user.username, role: user.role };
        }

        return;
    }

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findOneByUsername(username);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user; // eslint-disable-line
            return result;
        }

        return null;
    }

    async validateRoles(
        request: { ip; method; url; user; body },
        roles: ("Device" | "User" | "Admin")[],
    ): Promise<boolean> {
        const entity = Entity.convertFromReq(request);
        const { ip, method, url } = request;

        switch (entity.type) {
            case "User":
                const user = await this.usersService.findOneById(entity.id);

                if (!user) {
                    this.logger.warn(
                        `[${entity.name}] UnauthorizedException: Deleted user tried to access ${method} ${url} from ${ip} `,
                    );
                    throw new UnauthorizedException("User is deleted");
                }

                if (roles.includes(user.role)) {
                    return true;
                }

                break;
            case "Device":
                const device = await this.devicesService.findOne(entity.id);

                if (!device) {
                    this.logger.warn(
                        `[${entity.name}] UnauthorizedException: Deleted device tried to access ${method} ${url} from ${ip} `,
                    );
                    throw new UnauthorizedException("Device is deleted");
                }

                if (!device.accepted) {
                    this.logger.warn(
                        `[${entity.name}] UnauthorizedException: Not accepted device tried to access ${method} ${url} from ${ip} `,
                    );
                    throw new ForbiddenException("Device is not accepted");
                }

                if (roles.includes("Device") && device.accepted) {
                    return true;
                }

                break;
        }

        this.logger.warn(
            `[${entity.name}] ForbiddenException: Too low permissions to access ${method} ${url} ${ip} ${request.body && Object.keys(request.body).length > 0 ? JSON.stringify(request.body) : ""}`,
        );
        throw new ForbiddenException("You do not have permissions to access this path");
    }
}
