import { Controller, Get, UseGuards } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
// import { CreateCategoryDto } from "./dto/create-category.dto";
// import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Roles } from "../auth/roles.decorator";
import { Category } from "./types/category.interface";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    // ApiBearerAuth,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
} from "@nestjs/swagger";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    // @Post()
    // create(@Body() createCategoryDto: CreateCategoryDto) {
    //     return this.categoriesService.create(createCategoryDto);
    // }

    @Get()
    @Roles(["Device", "User", "Admin"])
    @UseGuards(new JwtAuthGuard(), RolesGuard)
    @ApiOperation({ summary: "Get all available categories" })
    @ApiResponse({ status: 200, description: "List of all categories", type: Array })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden - insufficient permissions" })
    // @ApiBearerAuth("JWT-auth")
    findAll(): Promise<Category[]> {
        return this.categoriesService.findAll();
    }

    // @Get(":id")
    // findOne(@Param("id") id: string) {
    //     return this.categoriesService.findOne(+id);
    // }

    // @Patch(":id")
    // update(@Param("id") id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    //     return this.categoriesService.update(+id, updateCategoryDto);
    // }

    // @Delete(":id")
    // remove(@Param("id") id: string) {
    //     return this.categoriesService.remove(+id);
    // }
}
