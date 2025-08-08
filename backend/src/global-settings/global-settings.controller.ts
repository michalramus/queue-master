import { Controller, Get, Body, Patch, UseGuards, Request } from "@nestjs/common";
import { GlobalSettingsService } from "./global-settings.service";
import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Entity } from "src/auth/types/entity.class";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    // ApiBearerAuth,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
} from "@nestjs/swagger";

@ApiTags("settings")
@Controller("settings/global")
export class GlobalSettingsController {
    constructor(private readonly globalSettingsService: GlobalSettingsService) {}

    @Get()
    @ApiOperation({ summary: "Get all global settings" })
    @ApiResponse({ status: 200, description: "Global settings retrieved successfully" })
    findAll() {
        return this.globalSettingsService.findAll();
    }

    @Patch()
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Update global settings" })
    @ApiBody({
        description: "Settings to update",
        schema: {
            type: "object",
            additionalProperties: {
                oneOf: [{ type: "string" }, { type: "number" }],
            },
        },
    })
    @ApiResponse({ status: 200, description: "Settings updated successfully" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden - Admin role required" })
    // @ApiBearerAuth("JWT-auth")
    update(@Body() settings: { [key: string]: string | number }, @Request() req) {
        return this.globalSettingsService.update(settings, Entity.convertFromReq(req));
    }
}
