import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Request } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { CategoryResponseDto, CategoryCreateDto, CategoryUpdateDto } from "./dto/category.dto";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiBadRequestResponse,
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
}
