import { Controller, Get, UseGuards } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
// import { CreateCategoryDto } from "./dto/create-category.dto";
// import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Roles } from "../auth/roles.decorator";

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
