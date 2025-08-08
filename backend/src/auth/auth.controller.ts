import { Controller, Post, UseGuards, Request, Body, ValidationPipe, Res, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtRefreshTokenAuthGuard } from "./guards/jwt-refreshToken-auth.guard";
import { LoginUserDto } from "./dto/login-user.dto";
import { Entity } from "./types/entity.class";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./roles.decorator";
import { Response } from "express";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    // ApiBearerAuth,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
} from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register-device")
    @Roles(["Admin", "User"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Register a new device" })
    @ApiResponse({ status: 201, description: "Device registered successfully" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden - insufficient permissions" })
    // @ApiBearerAuth("JWT-auth")
    async registerDevice(@Request() req) {
        return this.authService.registerDevice(Entity.convertFromReq(req));
    }

    @Post("login")
    @ApiOperation({
        summary: "User login - Get your access token here",
        description: `
Token is automatically saved in cookies, so you don't have to do anything more.
        `,
    })
    @ApiBody({
        type: LoginUserDto,
    })
    @ApiResponse({
        status: 200,
        description: "Login successful - Use the accessToken for authorization",
    })
    @ApiUnauthorizedResponse({
        description: "Invalid credentials - Check your username and password",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 401 },
                message: { type: "string", example: "Invalid credentials" },
                error: { type: "string", example: "Unauthorized" },
            },
        },
    })
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
    @ApiOperation({ summary: "Refresh access token" })
    @ApiResponse({ status: 200, description: "Token refreshed successfully" })
    @ApiUnauthorizedResponse({ description: "Invalid refresh token" })
    @ApiForbiddenResponse({ description: "Forbidden - insufficient permissions" })
    // @ApiBearerAuth("JWT-auth")
    async refresh(@Request() req, @Res({ passthrough: true }) res: Response) {
        return this.authService.refresh(Entity.convertFromReq(req), req.ip, res);
    }

    @Post("logout")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "User logout" })
    @ApiResponse({ status: 200, description: "Logout successful" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    // @ApiBearerAuth("JWT-auth")
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
    @ApiOperation({ summary: "Get authenticated user/device information" })
    @ApiResponse({ status: 200, description: "User/device information retrieved successfully" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden - insufficient permissions" })
    // @ApiBearerAuth("JWT-auth")
    async getInfo(@Request() req) {
        return this.authService.getInfo(Entity.convertFromReq(req));
    }
}
