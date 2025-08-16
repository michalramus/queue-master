import { Controller, Get, Post, Delete, Patch, Param, Body, UseGuards, Request, ParseIntPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserCreateDto, UserUpdateDto, UserPasswordUpdateDto, UserResponseDto } from "./dto/user.dto";
import { Roles } from "../auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Entity } from "src/auth/types/entity.class";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
    // ApiBearerAuth,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiConflictResponse,
    ApiNotFoundResponse,
} from "@nestjs/swagger";
import { MessageResponseDto } from "src/dto/messageResponse.dto";

@ApiTags("users")
@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Create a new user" })
    @ApiBody({ type: UserCreateDto })
    @ApiResponse({ status: 201, description: "User created", type: UserResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Insufficient permissions" })
    @ApiConflictResponse({ description: "Username already exists" })
    // @ApiBearerAuth("JWT-auth")
    async create(@Body() userCreateDto: UserCreateDto, @Request() req): Promise<UserResponseDto> {
        return this.usersService.create(userCreateDto, Entity.convertFromReq(req));
    }

    @Get()
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Get list of all users" })
    @ApiResponse({
        status: 200,
        description: "List of users retrieved",
        type: [UserResponseDto],
    })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Insufficient permissions" })
    // @ApiBearerAuth("JWT-auth")
    async findAll(): Promise<UserResponseDto[]> {
        return this.usersService.findAll();
    }

    @Patch(":id")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Update user username and/or role" })
    @ApiParam({ name: "id", description: "User ID", type: "number" })
    @ApiBody({ type: UserUpdateDto })
    @ApiResponse({
        status: 200,
        description: "User updated",
        type: UserResponseDto,
    })
    @ApiConflictResponse({ description: "Username already exists" })
    @ApiNotFoundResponse({ description: "User not found" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Insufficient permissions" })
    // @ApiBearerAuth("JWT-auth")
    async updateUser(
        @Param("id", ParseIntPipe) id: number,
        @Body() userUpdateDto: UserUpdateDto,
        @Request() req,
    ): Promise<UserResponseDto> {
        return this.usersService.updateUser(id, userUpdateDto, Entity.convertFromReq(req));
    }

    @Patch(":id/password")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Change user password" })
    @ApiParam({ name: "id", description: "User ID", type: "number" })
    @ApiBody({ type: UserPasswordUpdateDto })
    @ApiResponse({
        status: 200,
        description: "Password updated",
        type: MessageResponseDto,
    })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Insufficient permissions" })
    @ApiNotFoundResponse({ description: "User not found" })
    // @ApiBearerAuth("JWT-auth")
    async updatePassword(
        @Param("id", ParseIntPipe) id: number,
        @Body() userPasswordUpdateDto: UserPasswordUpdateDto,
        @Request() req,
    ): Promise<MessageResponseDto> {
        return this.usersService.updatePassword(id, userPasswordUpdateDto, Entity.convertFromReq(req));
    }

    @Delete(":id")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Delete a user" })
    @ApiParam({ name: "id", description: "User ID", type: "number" })
    @ApiResponse({
        status: 200,
        description: "User deleted",
        type: UserResponseDto,
    })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Insufficient permissions" })
    @ApiNotFoundResponse({ description: "User not found" })
    // @ApiBearerAuth("JWT-auth")
    async remove(@Param("id", ParseIntPipe) id: number, @Request() req): Promise<UserResponseDto> {
        return this.usersService.remove(id, Entity.convertFromReq(req));
    }
}
