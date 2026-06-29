import { Injectable, Logger, NotFoundException, ConflictException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CategoryResponseDto, CategoryCreateDto, CategoryUpdateDto } from "./dto/category.dto";
import { DeskResponseDto } from "src/desks/dto/desk.dto";
import { MultilingualTextService } from "src/multilingual-text/multilingual-text.service";
import { ModuleNameMultilingualText } from "src/multilingual-text/types/multilingualTextCategories.enum";
import { SseService } from "src/sse/sse.service";
import { sseEvents } from "src/sse/sseEvents.enum";
import { Entity } from "../auth/types/entity.class";
import { ClientsService } from "src/clients/clients.service";

@Injectable()
export class CategoriesService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly multilingualTextService: MultilingualTextService,
        private readonly sseService: SseService,
        private readonly clientsService: ClientsService,
    ) {}

    private logger = new Logger(CategoriesService.name);

    private readonly deskSelect = {
        id: true,
        desk_number: true,
        desk_name: true,
    } as const;

    private async buildCategoryResponse(category: {
        id: number;
        short_name: string;
        categories_desks: { desk: DeskResponseDto }[];
    }): Promise<CategoryResponseDto> {
        const name = await this.multilingualTextService.getMultilingualText(
            ModuleNameMultilingualText.categories,
            category.id,
        );
        return {
            id: category.id,
            short_name: category.short_name,
            name,
            desks: category.categories_desks.map((cd) => cd.desk),
        };
    }

    async findAll(): Promise<CategoryResponseDto[]> {
        const categories = await this.databaseService.category.findMany({
            orderBy: [{ id: "asc" }],
            select: {
                id: true,
                short_name: true,
                categories_desks: { select: { desk: { select: this.deskSelect } } },
            },
        });

        this.logger.debug(`Retrieved ${categories.length} categories`);
        return Promise.all(categories.map((category) => this.buildCategoryResponse(category)));
    }

    async findOne(id: number): Promise<CategoryResponseDto> {
        const category = await this.databaseService.category.findUnique({
            where: { id },
            select: {
                id: true,
                short_name: true,
                categories_desks: { select: { desk: { select: this.deskSelect } } },
            },
        });

        if (!category) {
            this.logger.warn(`Category with ID ${id} not found`);
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        this.logger.debug(`Retrieved category: ${category.short_name} (ID: ${id})`);
        return this.buildCategoryResponse(category);
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

        this.sseService.emit(sseEvents.CategoriesChanged, null);

        this.logger.log(`[${entity.name}] Successfully created category: ${category.short_name} (ID: ${category.id})`);

        return {
            id: category.id,
            short_name: category.short_name,
            name: createCategoryDto.name,
            desks: [],
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
                categories_desks: { select: { desk: { select: this.deskSelect } } },
            },
        });

        this.sseService.emit(sseEvents.CategoriesChanged, null);

        this.logger.log(`[${entity.name}] Successfully updated category: ${updatedCategory.short_name} (ID: ${id})`);

        return this.buildCategoryResponse(updatedCategory);
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

        // Delete all clients from this category
        await this.clientsService.removeAllFromCategory(id, entity);

        // Delete category-desk associations
        await this.databaseService.category_Desk.deleteMany({ where: { category_id: id } });

        // Delete category
        await this.databaseService.category.delete({
            where: { id },
        });

        // Delete associated multilingual text
        await this.multilingualTextService.deleteMultilingualText(ModuleNameMultilingualText.categories, id);

        this.sseService.emit(sseEvents.CategoriesChanged, null);

        this.logger.log(`[${entity.name}] Successfully deleted category: ${category.short_name} (ID: ${id})`);
    }

    async getDesks(id: number): Promise<DeskResponseDto[]> {
        const category = await this.databaseService.category.findUnique({
            where: { id },
            select: {
                id: true,
                categories_desks: { select: { desk: { select: this.deskSelect } } },
            },
        });
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return category.categories_desks.map((cd) => cd.desk);
    }

    async assignDesk(id: number, deskId: number, entity: Entity): Promise<CategoryResponseDto> {
        const category = await this.databaseService.category.findUnique({ where: { id } });
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        const desk = await this.databaseService.desk.findUnique({ where: { id: deskId } });
        if (!desk) {
            throw new NotFoundException(`Desk with ID ${deskId} not found`);
        }

        const existing = await this.databaseService.category_Desk.findUnique({
            where: { category_id_desk_id: { category_id: id, desk_id: deskId } },
        });
        if (existing) {
            throw new ConflictException(`Desk ${deskId} is already assigned to category ${id}`);
        }

        await this.databaseService.category_Desk.create({ data: { category_id: id, desk_id: deskId } });

        this.logger.log(`[${entity.name}] Assigned desk ${deskId} to category ${id}`);
        this.sseService.emit(sseEvents.CategoriesDesksChanged, null);

        const updated = await this.databaseService.category.findUnique({
            where: { id },
            select: {
                id: true,
                short_name: true,
                categories_desks: { select: { desk: { select: this.deskSelect } } },
            },
        });
        return this.buildCategoryResponse(updated);
    }

    async removeDesk(id: number, deskId: number, entity: Entity): Promise<CategoryResponseDto> {
        const category = await this.databaseService.category.findUnique({ where: { id } });
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        const link = await this.databaseService.category_Desk.findUnique({
            where: { category_id_desk_id: { category_id: id, desk_id: deskId } },
        });
        if (!link) {
            throw new NotFoundException(`Desk ${deskId} is not assigned to category ${id}`);
        }

        await this.databaseService.category_Desk.delete({
            where: { category_id_desk_id: { category_id: id, desk_id: deskId } },
        });

        this.logger.log(`[${entity.name}] Removed desk ${deskId} from category ${id}`);
        this.sseService.emit(sseEvents.CategoriesDesksChanged, null);

        const updated = await this.databaseService.category.findUnique({
            where: { id },
            select: {
                id: true,
                short_name: true,
                categories_desks: { select: { desk: { select: this.deskSelect } } },
            },
        });
        return this.buildCategoryResponse(updated);
    }
}
