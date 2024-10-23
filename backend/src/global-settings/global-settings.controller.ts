import { Controller, Get, Body, Patch, UseGuards, Request } from "@nestjs/common";
import { GlobalSettingsService } from "./global-settings.service";
import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Entity } from "src/auth/types/entity.class";

@Controller("settings/global")
export class GlobalSettingsController {
    constructor(private readonly globalSettingsService: GlobalSettingsService) {}

    @Get()
    findAll() {
        return this.globalSettingsService.findAll();
    }

    @Patch()
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    update(@Body() settings: { [key: string]: string | number }, @Request() req) {
        return this.globalSettingsService.update(settings, Entity.convertFromReq(req));
    }
}
