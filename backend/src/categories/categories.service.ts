import { Injectable } from "@nestjs/common";
// import { CreateCategoryDto } from "./dto/create-category.dto";
// import { UpdateCategoryDto } from "./dto/update-category.dto";
import { DatabaseService } from "../database/database.service";
import { Category } from "./types/category.interface";

@Injectable()
export class CategoriesService {
    constructor(private readonly databaseService: DatabaseService) {}
    // create(createCategoryDto: CreateCategoryDto) {
    //     return "This action adds a new category";
    // }

    findAll(): Promise<Category[]> {
        return this.databaseService.category.findMany({
            orderBy: [
                {
                    id: "asc",
                },
            ],

            select: {
                id: true,
                short_name: true,
                name: true,
            },
        });
    }

    // findOne(id: number) {
    //     return `This action returns a #${id} category`;
    // }

    // update(id: number, updateCategoryDto: UpdateCategoryDto) {
    //     return `This action updates a #${id} category`;
    // }

    // remove(id: number) {
    //     return `This action removes a #${id} category`;
    // }
}
