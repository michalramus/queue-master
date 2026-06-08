import { Controller, Get, Patch, Body, UseGuards, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody } from "@nestjs/swagger";
import { MultilingualSettingsService } from "./multilingual-settings.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Entity } from "../auth/types/entity.class";
import { MultilingualSettingsInterface } from "./types/multilingual-settings.interface";

@ApiTags("Multilingual Settings")
@Controller("settings/multilingual")
export class MultilingualSettingsController {
    constructor(private readonly multilingualSettingsService: MultilingualSettingsService) {}

    @Get()
    @ApiOperation({
        summary: "Get all multilingual settings",
        description:
            "Retrieves language-specific settings. Only languages which were set are returned. No authentication required. Returns only languages that have values stored in the database.",
    })
    @ApiResponse({
        status: 200,
        description:
            "Multilingual settings retrieved successfully. Returns an object with settings grouped by property name, each containing translations for stored languages.",
        schema: {
            type: "object",
            properties: {
                printing_ticket_template: {
                    type: "object",
                    additionalProperties: { type: "string" },
                    example: {
                        en: "<div>English template</div>",
                        pl: "<div>Polish template</div>",
                    },
                },
            },
        },
    })
    findAll(): Promise<MultilingualSettingsInterface> {
        return this.multilingualSettingsService.findAll();
    }

    @Patch()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(["Admin"])
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Update multilingual settings (Admin only)",
        description:
            "Updates language-specific settings. Only specify the properties and languages you want to modify - unmentioned properties remain unchanged; unmentioned languages will be deleted. Set a language value to null or empty string or not mention to delete it.",
    })
    @ApiBody({
        description: "Partial multilingual settings object. Only include properties you want to update.",
        schema: {
            type: "object",
            properties: {
                printing_ticket_template: {
                    type: "object",
                    additionalProperties: { type: "string", nullable: true },
                    example: {
                        en: '<div style="text-align:center">English template</div>',
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description:
            "Multilingual settings updated successfully. Returns the complete updated settings object with all stored language translations. SSE event 'MultilingualSettingsChanged' is emitted to notify clients.",
        schema: {
            type: "object",
            properties: {
                printing_ticket_template: {
                    type: "object",
                    additionalProperties: { type: "string" },
                },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: "Invalid request - unknown setting property or invalid format",
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized - valid JWT token required",
    })
    @ApiResponse({
        status: 403,
        description: "Forbidden - Admin role required",
    })
    update(
        @Body() settings: Partial<MultilingualSettingsInterface>,
        @Req() req: any,
    ): Promise<MultilingualSettingsInterface> {
        return this.multilingualSettingsService.update(settings, Entity.convertFromReq(req));
    }
}
