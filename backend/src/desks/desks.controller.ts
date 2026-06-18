import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, Request } from "@nestjs/common";
import { DesksService } from "./desks.service";
import { DeskCreateDto, DeskUpdateDto, DeskCategoryDto, DeskResponseDto } from "./dto/desk.dto";
import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Entity } from "src/auth/types/entity.class";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiBadRequestResponse,
    ApiParam,
} from "@nestjs/swagger";

@ApiTags("desks")
@Controller("desks")
export class DesksController {
    constructor(private readonly desksService: DesksService) {}

    @Post()
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Create a new desk" })
    @ApiResponse({ status: 201, description: "Desk created", type: DeskResponseDto })
    @ApiConflictResponse({ description: "Desk number or name already exists" })
    @ApiBadRequestResponse({ description: "Invalid input data" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Admin access required" })
    create(@Body() createDeskDto: DeskCreateDto, @Request() req): Promise<DeskResponseDto> {
        return this.desksService.create(createDeskDto, Entity.convertFromReq(req));
    }

    @Get()
    @Roles(["Device", "User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Get all desks" })
    @ApiResponse({ status: 200, description: "List of all desks", type: [DeskResponseDto] })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Insufficient permissions" })
    findAll(): Promise<DeskResponseDto[]> {
        return this.desksService.findAll();
    }

    @Get(":id")
    @Roles(["Device", "User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Get desk by ID" })
    @ApiParam({ name: "id", type: "number" })
    @ApiResponse({ status: 200, description: "Desk details", type: DeskResponseDto })
    @ApiNotFoundResponse({ description: "Desk not found" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Insufficient permissions" })
    findOne(@Param("id", ParseIntPipe) id: number): Promise<DeskResponseDto> {
        return this.desksService.findOne(id);
    }

    @Patch(":id")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Update desk" })
    @ApiParam({ name: "id", type: "number" })
    @ApiResponse({ status: 200, description: "Desk updated", type: DeskResponseDto })
    @ApiNotFoundResponse({ description: "Desk not found" })
    @ApiConflictResponse({ description: "Desk number or name already exists" })
    @ApiBadRequestResponse({ description: "Invalid input data" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Admin access required" })
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateDeskDto: DeskUpdateDto,
        @Request() req,
    ): Promise<DeskResponseDto> {
        return this.desksService.update(id, updateDeskDto, Entity.convertFromReq(req));
    }

    @Delete(":id")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Delete a desk (also deletes assigned clients)" })
    @ApiParam({ name: "id", type: "number" })
    @ApiResponse({ status: 200, description: "Desk deleted", type: DeskResponseDto })
    @ApiNotFoundResponse({ description: "Desk not found" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Admin access required" })
    remove(@Param("id", ParseIntPipe) id: number, @Request() req): Promise<DeskResponseDto> {
        return this.desksService.remove(id, Entity.convertFromReq(req));
    }

    @Post(":id/categories")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Assign a category to a desk" })
    @ApiParam({ name: "id", type: "number", description: "Desk ID" })
    @ApiResponse({ status: 201, description: "Category assigned to desk", type: DeskResponseDto })
    @ApiNotFoundResponse({ description: "Desk or category not found" })
    @ApiConflictResponse({ description: "Category already assigned to this desk" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Admin access required" })
    assignCategory(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: DeskCategoryDto,
        @Request() req,
    ): Promise<DeskResponseDto> {
        return this.desksService.assignCategory(id, dto, Entity.convertFromReq(req));
    }

    @Delete(":id/categories/:categoryId")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Remove a category from a desk" })
    @ApiParam({ name: "id", type: "number", description: "Desk ID" })
    @ApiParam({ name: "categoryId", type: "number", description: "Category ID" })
    @ApiResponse({ status: 200, description: "Category removed from desk", type: DeskResponseDto })
    @ApiNotFoundResponse({ description: "Desk not found or category not assigned" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Admin access required" })
    removeCategory(
        @Param("id", ParseIntPipe) id: number,
        @Param("categoryId", ParseIntPipe) categoryId: number,
        @Request() req,
    ): Promise<DeskResponseDto> {
        return this.desksService.removeCategory(id, categoryId, Entity.convertFromReq(req));
    }
}
