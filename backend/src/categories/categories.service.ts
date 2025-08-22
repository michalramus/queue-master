import { Injectable, Logger, NotFoundException, ConflictException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CategoryResponseDto, CategoryCreateDto, CategoryUpdateDto } from "./dto/category.dto";
import { MultilingualTextService } from "src/multilingual-text/multilingual-text.service";
import { ModuleNameMultilingualText } from "src/multilingual-text/types/multilingualTextCategories.enum";
import { WebsocketsService } from "src/websockets/websockets.service";
import { Entity } from "../auth/types/entity.class";

@Injectable()
export class CategoriesService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly multilingualTextService: MultilingualTextService,
        private readonly websocketsService: WebsocketsService,
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
            },
        });

        const convertedCategories = Promise.all(
            categories.map(async (category) => {
                const name = await this.multilingualTextService.getMultilingualText(
                    ModuleNameMultilingualText.categories,
                    category.id,
                );
                return { id: category.id, short_name: category.short_name, name: name };
            }),
        );

        this.logger.debug(`Retrieved ${categories.length} categories`);

        return convertedCategories;
    }

    async findOne(id: number): Promise<CategoryResponseDto> {
        const category = await this.databaseService.category.findUnique({
            where: { id },
            select: {
                id: true,
                short_name: true,
            },
        });

        if (!category) {
            this.logger.warn(`Category with ID ${id} not found`);
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        const name = await this.multilingualTextService.getMultilingualText(
            ModuleNameMultilingualText.categories,
            category.id,
        );
        this.logger.debug(`Retrieved category: ${category.short_name} (ID: ${id})`);

        return {
            id: category.id,
            short_name: category.short_name,
            name: name,
        };
    }

    async create(createCategoryDto: CategoryCreateDto, entity: Entity): Promise<CategoryResponseDto> {
        // Check if short_name already exists
        const existingCategory = await this.databaseService.category.findUnique({
            where: { short_name: createCategoryDto.short_name },
        });

        if (existingCategory) {
            this.logger.warn(
                `[${entity.name}]Category creation failed - short name '${createCategoryDto.short_name}' already exists`,
            );
            throw new ConflictException(`Category with short name '${createCategoryDto.short_name}' already exists`);
        }

        // Create category with required fields
        const category = await this.databaseService.category.create({
            data: {
                short_name: createCategoryDto.short_name,
                counter: 0, // Initialize counter to 0
                last_counter_reset: new Date(), // Set to current date
            },
            select: {
                id: true,
                short_name: true,
            },
        });

        // Create multilingual text first
        await this.multilingualTextService.updateMultilingualText(
            ModuleNameMultilingualText.categories,
            category.id,
            createCategoryDto.name,
        );

        // Emit WebSocket event to reload frontend
        this.websocketsService.reloadFrontend();

        this.logger.log(`[${entity.name}] Successfully created category: ${category.short_name} (ID: ${category.id})`);

        return {
            id: category.id,
            short_name: category.short_name,
            name: createCategoryDto.name,
        };
    }

    async update(id: number, updateCategoryDto: CategoryUpdateDto, entity: Entity): Promise<CategoryResponseDto> {
        const category = await this.databaseService.category.findUnique({
            where: { id },
        });

        if (!category) {
            this.logger.warn(`[${entity.name}] Update failed - Category with ID ${id} not found`);
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        // If updating short_name, check for conflicts
        if (updateCategoryDto.short_name && updateCategoryDto.short_name !== category.short_name) {
            const existingCategory = await this.databaseService.category.findUnique({
                where: { short_name: updateCategoryDto.short_name },
            });

            if (existingCategory) {
                this.logger.warn(
                    `[${entity.name}] Update failed - short name '${updateCategoryDto.short_name}' already exists`,
                );
                throw new ConflictException(
                    `Category with short name '${updateCategoryDto.short_name}' already exists`,
                );
            }
        }

        // Update category short name if provided
        if (updateCategoryDto.short_name) {
            await this.databaseService.category.update({
                where: { id },
                data: {
                    short_name: updateCategoryDto.short_name,
                },
            });
        }

        // Update multilingual text if provided
        if (updateCategoryDto.name) {
            await this.multilingualTextService.updateMultilingualText(
                ModuleNameMultilingualText.categories,
                id,
                updateCategoryDto.name,
            );
        }

        // Fetch updated category
        const updatedCategory = await this.databaseService.category.findUnique({
            where: { id },
            select: {
                id: true,
                short_name: true,
            },
        });

        const name = await this.multilingualTextService.getMultilingualText(
            ModuleNameMultilingualText.categories,
            updatedCategory.id,
        );

        // Emit WebSocket event to reload frontend
        this.websocketsService.reloadFrontend();

        this.logger.log(`[${entity.name}] Successfully updated category: ${updatedCategory.short_name} (ID: ${id})`);

        return {
            id: updatedCategory.id,
            short_name: updatedCategory.short_name,
            name: name,
        };
    }

    async remove(id: number, entity: Entity): Promise<void> {
        const category = await this.databaseService.category.findUnique({
            where: { id },
            select: {
                id: true,
                short_name: true,
            },
        });

        if (!category) {
            this.logger.warn(`[${entity.name}] Delete failed - Category with ID ${id} not found`);
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        // Delete category first
        await this.databaseService.category.delete({
            where: { id },
        });

        // Delete associated multilingual text
        await this.multilingualTextService.deleteMultilingualText(ModuleNameMultilingualText.categories, id);

        // Emit WebSocket event to reload frontend
        this.websocketsService.reloadFrontend();

        this.logger.log(`[${entity.name}] Successfully deleted category: ${category.short_name} (ID: ${id})`);
    }
}
