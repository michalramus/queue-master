import { Injectable, Logger } from "@nestjs/common";
// import { CreateCategoryDto } from "./dto/create-category.dto";
// import { UpdateCategoryDto } from "./dto/update-category.dto";
import { DatabaseService } from "../database/database.service";
import { CategoryResponseDto } from "./dto/category.dto";
import { MultilingualTextService } from "src/multilingual-text/multilingual-text.service";
import { MultilingualTextCategories } from "src/multilingual-text/types/multilingualTextCategories.enum";

@Injectable()
export class CategoriesService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly multilingualTextService: MultilingualTextService,
    ) {}

    private logger = new Logger(CategoriesService.name);

    async findAll(): Promise<CategoryResponseDto[]> {
        const categories = await this.databaseService.category.findMany({
            orderBy: [
                {
                    id: "asc",
                },
            ],

            select: {
                id: true,
                short_name: true,
                multilingual_text_key: true,
            },
        });

        const convertedCategories = Promise.all(
            categories.map(async (category) => {
                const name = await this.multilingualTextService.getMultilingualText(
                    MultilingualTextCategories.categories,
                    category.multilingual_text_key,
                );
                return { id: category.id, short_name: category.short_name, name: name };
            }),
        );

        return convertedCategories;
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
