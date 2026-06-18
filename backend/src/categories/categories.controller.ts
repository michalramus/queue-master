import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Request } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { CategoryResponseDto, CategoryCreateDto, CategoryUpdateDto } from "./dto/category.dto";
import { DeskResponseDto } from "src/desks/dto/desk.dto";

import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiBadRequestResponse,
    ApiParam,
    ApiBody,
} from "@nestjs/swagger";
import { Entity } from "src/auth/types/entity.class";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Create a new category" })
    @ApiResponse({ status: 201, description: "Category created successfully", type: CategoryResponseDto })
    @ApiConflictResponse({ description: "Category with the same short name already exists" })
    @ApiBadRequestResponse({ description: "Invalid input data" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Admin access required" })
    create(@Body() createCategoryDto: CategoryCreateDto, @Request() req): Promise<CategoryResponseDto> {
        return this.categoriesService.create(createCategoryDto, Entity.convertFromReq(req));
    }

    @Get()
    @Roles(["Device", "User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Get all available categories" })
    @ApiResponse({ status: 200, description: "List of all categories", type: [CategoryResponseDto] })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Insufficient permissions" })
    findAll(): Promise<CategoryResponseDto[]> {
        return this.categoriesService.findAll();
    }

    @Get(":id")
    @Roles(["Device", "User", "Admin"])
    @ApiOperation({ summary: "Get category by ID" })
    @ApiResponse({ status: 200, description: "Category details", type: CategoryResponseDto })
    @ApiNotFoundResponse({ description: "Category not found" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Insufficient permissions" })
    findOne(@Param("id", ParseIntPipe) id: number): Promise<CategoryResponseDto> {
        return this.categoriesService.findOne(id);
    }

    @Patch(":id")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Update category short name and/or translations" })
    @ApiResponse({ status: 200, description: "Category updated successfully", type: CategoryResponseDto })
    @ApiNotFoundResponse({ description: "Category not found" })
    @ApiConflictResponse({ description: "Category with the same short name already exists" })
    @ApiBadRequestResponse({ description: "Invalid input data" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Admin access required" })
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateCategoryDto: CategoryUpdateDto,
        @Request() req,
    ): Promise<CategoryResponseDto> {
        return this.categoriesService.update(id, updateCategoryDto, Entity.convertFromReq(req));
    }

    @Delete(":id")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Delete a category" })
    @ApiResponse({ status: 204, description: "Category deleted successfully" })
    @ApiNotFoundResponse({ description: "Category not found" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Admin access required" })
    async remove(@Param("id", ParseIntPipe) id: number, @Request() req): Promise<void> {
        return this.categoriesService.remove(id, Entity.convertFromReq(req));
    }

    @Get(":id/desks")
    @Roles(["Device", "User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Get desks assigned to a category" })
    @ApiParam({ name: "id", type: "number", description: "Category ID" })
    @ApiResponse({ status: 200, description: "List of desks assigned to category", type: [DeskResponseDto] })
    @ApiNotFoundResponse({ description: "Category not found" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Insufficient permissions" })
    getDesks(@Param("id", ParseIntPipe) id: number): Promise<DeskResponseDto[]> {
        return this.categoriesService.getDesks(id);
    }

    @Post(":id/desks")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Assign a desk to a category" })
    @ApiParam({ name: "id", type: "number", description: "Category ID" })
    @ApiBody({ schema: { type: "object", properties: { desk_id: { type: "number" } }, required: ["desk_id"] } })
    @ApiResponse({ status: 201, description: "Desk assigned to category", type: CategoryResponseDto })
    @ApiNotFoundResponse({ description: "Category or desk not found" })
    @ApiConflictResponse({ description: "Desk already assigned to this category" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Admin access required" })
    assignDesk(
        @Param("id", ParseIntPipe) id: number,
        @Body("desk_id", ParseIntPipe) deskId: number,
        @Request() req,
    ): Promise<CategoryResponseDto> {
        return this.categoriesService.assignDesk(id, deskId, Entity.convertFromReq(req));
    }

    @Delete(":id/desks/:deskId")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Remove a desk from a category" })
    @ApiParam({ name: "id", type: "number", description: "Category ID" })
    @ApiParam({ name: "deskId", type: "number", description: "Desk ID" })
    @ApiResponse({ status: 200, description: "Desk removed from category", type: CategoryResponseDto })
    @ApiNotFoundResponse({ description: "Category not found or desk not assigned" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Admin access required" })
    removeDesk(
        @Param("id", ParseIntPipe) id: number,
        @Param("deskId", ParseIntPipe) deskId: number,
        @Request() req,
    ): Promise<CategoryResponseDto> {
        return this.categoriesService.removeDesk(id, deskId, Entity.convertFromReq(req));
    }
}
