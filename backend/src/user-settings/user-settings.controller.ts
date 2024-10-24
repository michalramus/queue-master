import { Controller, Get, Body, Patch, Param, UseGuards, Request, ParseIntPipe } from "@nestjs/common";
import { UserSettingsService } from "./user-settings.service";
import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Entity } from "src/auth/types/entity.class";

@Controller("settings/user")
export class UserSettingsController {
    constructor(private readonly userSettingsService: UserSettingsService) {}

    /**
     * Get all settings for currently logged in user
     */

    @Get()
    @Roles(["Admin", "User"])
    @UseGuards(JwtAuthGuard, RolesGuard)
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
    findUserSettings(@Param("id", ParseIntPipe) id: number) {
        return this.userSettingsService.findUserSettings(id);
    }

    @Patch()
    @Roles(["Admin", "User"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    updateSettings(@Body() settings: { [key: string]: string | number }, @Request() req) {
        return this.userSettingsService.updateSettings(settings, Entity.convertFromReq(req));
    }

    @Patch(":id")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    updateUserSettings(
        @Param("id", ParseIntPipe) id: number,
        @Body() settings: { [key: string]: string | number },
        @Request() req,
    ) {
        return this.userSettingsService.updateUserSettings(id, settings, Entity.convertFromReq(req));
    }
}
