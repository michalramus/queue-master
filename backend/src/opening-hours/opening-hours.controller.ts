import { Controller, Get, Post, Body, UseGuards, Request } from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
} from "@nestjs/swagger";
import { Opening_Hours } from "@prisma/client";
import { OpeningHoursService } from "./opening-hours.service";
import { OpeningHoursDto, CreateOpeningHoursDto } from "./dto/opening-hours.dto";
import { Roles } from "../auth/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Entity } from "../auth/types/entity.class";

@ApiTags("opening-hours")
@Controller("opening-hours")
export class OpeningHoursController {
    constructor(private readonly openingHoursService: OpeningHoursService) {}

    @Get()
    @Roles(["Device", "User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Get all opening hours" })
    @ApiResponse({
        status: 200,
        description: "Returns all opening hours ordered by day of week",
        schema: {
            type: "array",
            items: { $ref: "#/components/schemas/OpeningHoursDto" },
        },
    })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Insufficient permissions" })
    async findAll(): Promise<Opening_Hours[]> {
        const openingHours = await this.openingHoursService.findAll();

        return openingHours;
    }

    @Post()
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Create or override opening hours for multiple days" })
    @ApiBody({ type: CreateOpeningHoursDto })
    @ApiResponse({
        status: 201,
        description:
            "Opening hours created/overridden successfully. When marking a day as closed, existing hours are preserved unless new ones are provided. Invalid time ranges are skipped.",
        type: [OpeningHoursDto],
    })
    @ApiResponse({
        status: 400,
        description: "Invalid input data",
    })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Admin access required" })
    async create(@Body() createDto: CreateOpeningHoursDto, @Request() req): Promise<Opening_Hours[]> {
        return this.openingHoursService.create(createDto, Entity.convertFromReq(req));
    }
}
