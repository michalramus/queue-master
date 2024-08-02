import { Controller, Post, UseGuards, Request, Body, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtRefreshTokenAuthGuard } from "./guards/jwt-refreshToken-auth.guard";
import { LoginUserDto } from "./dto/login-user.dto";
import { Entity } from "./types/entity.class";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./roles.decorator";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register-device")
    async registerDevice(@Request() req) {
        return this.authService.RegisterDevice(req.headers, req.ip);
    }

    @Post("login")
    async login(@Body(ValidationPipe) loginUserDto: LoginUserDto, @Request() req) {
        return this.authService.login(loginUserDto, req.ip);
    }

    @Post("refresh")
    @Roles(["User", "Admin"])
    @UseGuards(JwtRefreshTokenAuthGuard, RolesGuard)
    async refresh(@Request() req) {
        return this.authService.refresh(Entity.convertFromReq(req), req.ip);
    }
}
