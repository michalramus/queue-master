import { Controller, Post, UseGuards, Request, Body, ValidationPipe, Res, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtRefreshTokenAuthGuard } from "./guards/jwt-refreshToken-auth.guard";
import { LoginUserDto } from "./dto/login-user.dto";
import { Entity } from "./types/entity.class";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./roles.decorator";
import { Response } from "express";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register-device")
    @Roles(["Admin", "User"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    async registerDevice(@Request() req) {
        return this.authService.registerDevice(Entity.convertFromReq(req));
    }

    @Post("login")
    async login(
        @Body(ValidationPipe) loginUserDto: LoginUserDto,
        @Request() req,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authService.login(loginUserDto, req.ip, res);
    }

    @Post("refresh")
    @Roles(["Admin", "User"])
    @UseGuards(JwtRefreshTokenAuthGuard, RolesGuard)
    async refresh(@Request() req, @Res({ passthrough: true }) res: Response) {
        return this.authService.refresh(Entity.convertFromReq(req), req.ip, res);
    }

    @Post("logout")
    @UseGuards(JwtAuthGuard, RolesGuard)
    async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
        return this.authService.logout(Entity.convertFromReq(req), res);
    }

    /**
     *
     * @returns Info about logged user or device
     */
    @Get("get-info")
    @Roles(["Device", "User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getInfo(@Request() req) {
        return this.authService.getInfo(Entity.convertFromReq(req));
    }
}
