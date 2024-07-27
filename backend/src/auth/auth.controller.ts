import { Controller, Post, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtRefreshTokenAuthGuard } from "./guards/jwt-refreshToken-auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register-device")
    async registerDevice(@Request() req) {
        return this.authService.RegisterDevice(req.headers);
    }

    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtRefreshTokenAuthGuard)
    @Post("refresh")
    async refresh(@Request() req) {
        return this.authService.refresh(req.user);
    }
}
