import { Controller, Get, Body, Patch, Param, UseGuards, Request, ParseIntPipe } from "@nestjs/common";
import { UserSettingsService } from "./user-settings.service";
import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Entity } from "src/auth/types/entity.class";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
} from "@nestjs/swagger";

@ApiTags("settings")
@Controller("settings/user")
export class UserSettingsController {
    constructor(private readonly userSettingsService: UserSettingsService) {}

    /**
     * Get all settings for currently logged in user
     */

    @Get()
    @Roles(["Admin", "User"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Get settings for currently logged in user" })
    @ApiResponse({
        status: 200,
        description: "User settings retrieved",
        schema: {
            type: "object",
            description: "JSON string containing user settings",
            example: '{"desk": "1", "notifications": true}',
        },
    })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Insufficient permissions" })
    // @ApiBearerAuth("JWT-auth")
    findSettings(@Request() req) {
        return this.userSettingsService.findSettings(Entity.convertFromReq(req));
    }

    /**
     * Get all settings for a specific user
     * @param id
     */
    @Get(":id")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Get settings for a specific user (Admin only)" })
    @ApiParam({ name: "id", description: "User ID", type: "number" })
    @ApiResponse({
        status: 200,
        description: "User settings retrieved",
        schema: {
            type: "object",
            description: "JSON string containing user settings",
            example: '{"desk": "1", "notifications": true}',
        },
    })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden - Admin role required" })
    // @ApiBearerAuth("JWT-auth")
    findUserSettings(@Param("id", ParseIntPipe) id: number) {
        return this.userSettingsService.findUserSettings(id);
    }

    @Patch()
    @Roles(["Admin", "User"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Update settings for currently logged in user" })
    @ApiBody({
        description: "Only settings to update",
        schema: {
            type: "object",
            additionalProperties: {
                oneOf: [{ type: "string" }, { type: "number" }],
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: "Settings updated",
        schema: {
            type: "object",
            description: "JSON string containing all user settings(including updated)",
            example: '{"desk": "1", "notifications": true}',
        },
    })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Insufficient permissions" })
    // @ApiBearerAuth("JWT-auth")
    updateSettings(@Body() settings: { [key: string]: string | number }, @Request() req) {
        return this.userSettingsService.updateSettings(settings, Entity.convertFromReq(req));
    }

    @Patch(":id")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Update settings for a specific user (Admin only)" })
    @ApiParam({ name: "id", description: "User ID", type: "number" })
    @ApiBody({
        description: "Only settings to update ",
        schema: {
            type: "object",
            additionalProperties: {
                oneOf: [{ type: "string" }, { type: "number" }],
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: "Settings updated",
        schema: {
            type: "object",
            description: "JSON string containing all user settings(including updated)",
            example: '{"desk": "1", "notifications": true}',
        },
    })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden - Admin role required" })
    // @ApiBearerAuth("JWT-auth")
    updateUserSettings(
        @Param("id", ParseIntPipe) id: number,
        @Body() settings: { [key: string]: string | number },
        @Request() req,
    ) {
        return this.userSettingsService.updateUserSettings(id, settings, Entity.convertFromReq(req));
    }
}
