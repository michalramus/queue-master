import { Injectable, Logger, NotFoundException, ConflictException } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { Entity } from "src/auth/types/entity.class";
import { DeskCreateDto, DeskUpdateDto, DeskCategoryDto, DeskResponseDto } from "./dto/desk.dto";
import { SseService } from "src/sse/sse.service";
import { sseEvents } from "src/sse/sseEvents.enum";

const deskSelect = {
    id: true,
    desk_number: true,
    desk_name: true,
    categories_desks: {
        select: {
            category: { select: { id: true, short_name: true } },
        },
    },
} as const;

function mapDeskResponse(desk: {
    id: number;
    desk_number: number;
    desk_name: string;
    categories_desks: { category: { id: number; short_name: string } }[];
}): DeskResponseDto {
    return {
        id: desk.id,
        desk_number: desk.desk_number,
        desk_name: desk.desk_name,
        categories: desk.categories_desks.map((cd) => cd.category),
    };
}

@Injectable()
export class DesksService {
    private readonly logger = new Logger(DesksService.name);

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly sseService: SseService,
    ) {}

    async findAll(): Promise<DeskResponseDto[]> {
        const desks = await this.databaseService.desk.findMany({
            orderBy: { desk_number: "asc" },
            select: deskSelect,
        });
        this.logger.debug(`Fetched ${desks.length} desks`);
        return desks.map(mapDeskResponse);
    }

    async findOne(id: number): Promise<DeskResponseDto> {
        const desk = await this.databaseService.desk.findUnique({
            where: { id },
            select: deskSelect,
        });
        if (!desk) {
            throw new NotFoundException(`Desk with ID ${id} not found`);
        }
        return mapDeskResponse(desk);
    }

    async create(createDeskDto: DeskCreateDto, entity: Entity): Promise<DeskResponseDto> {
        await this.assertNoDuplicate(createDeskDto.desk_number);

        const desk = await this.databaseService.desk.create({
            data: {
                desk_number: createDeskDto.desk_number,
                desk_name: createDeskDto.desk_name,
            },
            select: deskSelect,
        });

        this.logger.log(`[${entity.name}] Created desk "${desk.desk_name}" (#${desk.desk_number})`);
        return mapDeskResponse(desk);
    }

    async update(id: number, updateDeskDto: DeskUpdateDto, entity: Entity): Promise<DeskResponseDto> {
        const desk = await this.databaseService.desk.findUnique({ where: { id } });
        if (!desk) {
            throw new NotFoundException(`Desk with ID ${id} not found`);
        }

        if (updateDeskDto.desk_number !== undefined && updateDeskDto.desk_number !== desk.desk_number) {
            const conflict = await this.databaseService.desk.findUnique({
                where: { desk_number: updateDeskDto.desk_number },
            });
            if (conflict) {
                throw new ConflictException(`Desk with number ${updateDeskDto.desk_number} already exists`);
            }
        }

        const updated = await this.databaseService.desk.update({
            where: { id },
            data: {
                desk_number: updateDeskDto.desk_number,
                desk_name: updateDeskDto.desk_name,
            },
            select: deskSelect,
        });

        this.logger.log(`[${entity.name}] Updated desk ID ${id}`);
        this.sseService.emit(sseEvents.DesksChanged, null);
        return mapDeskResponse(updated);
    }

    async remove(id: number, entity: Entity): Promise<DeskResponseDto> {
        const desk = await this.databaseService.desk.findUnique({ where: { id }, select: deskSelect });
        if (!desk) {
            throw new NotFoundException(`Desk with ID ${id} not found`);
        }

        // Delete all clients assigned to this desk
        await this.databaseService.client.deleteMany({ where: { desk_id: id } });

        // Unset default_desk for users referencing this desk
        await this.databaseService.user.updateMany({
            where: { default_desk_id: id },
            data: { default_desk_id: null },
        });

        // Delete category-desk associations
        await this.databaseService.category_Desk.deleteMany({ where: { desk_id: id } });

        await this.databaseService.desk.delete({ where: { id } });

        this.logger.log(`[${entity.name}] Deleted desk "${desk.desk_name}" (#${desk.desk_number})`);
        this.sseService.emit(sseEvents.DesksChanged, null);
        return mapDeskResponse(desk);
    }

    async assignCategory(id: number, dto: DeskCategoryDto, entity: Entity): Promise<DeskResponseDto> {
        const desk = await this.databaseService.desk.findUnique({ where: { id } });
        if (!desk) {
            throw new NotFoundException(`Desk with ID ${id} not found`);
        }

        const category = await this.databaseService.category.findUnique({ where: { id: dto.category_id } });
        if (!category) {
            throw new NotFoundException(`Category with ID ${dto.category_id} not found`);
        }

        const existing = await this.databaseService.category_Desk.findUnique({
            where: { category_id_desk_id: { category_id: dto.category_id, desk_id: id } },
        });
        if (existing) {
            throw new ConflictException(`Category ${dto.category_id} is already assigned to desk ${id}`);
        }

        await this.databaseService.category_Desk.create({
            data: { category_id: dto.category_id, desk_id: id },
        });

        this.logger.log(`[${entity.name}] Assigned category ${dto.category_id} to desk ${id}`);
        this.sseService.emit(sseEvents.CategoriesDesksChanged, null);
        const updated = await this.databaseService.desk.findUnique({ where: { id }, select: deskSelect });
        return mapDeskResponse(updated);
    }

    async removeCategory(id: number, categoryId: number, entity: Entity): Promise<DeskResponseDto> {
        const desk = await this.databaseService.desk.findUnique({ where: { id } });
        if (!desk) {
            throw new NotFoundException(`Desk with ID ${id} not found`);
        }

        const link = await this.databaseService.category_Desk.findUnique({
            where: { category_id_desk_id: { category_id: categoryId, desk_id: id } },
        });
        if (!link) {
            throw new NotFoundException(`Category ${categoryId} is not assigned to desk ${id}`);
        }

        await this.databaseService.category_Desk.delete({
            where: { category_id_desk_id: { category_id: categoryId, desk_id: id } },
        });

        this.logger.log(`[${entity.name}] Removed category ${categoryId} from desk ${id}`);
        this.sseService.emit(sseEvents.CategoriesDesksChanged, null);
        const updated = await this.databaseService.desk.findUnique({ where: { id }, select: deskSelect });
        return mapDeskResponse(updated);
    }

    private async assertNoDuplicate(deskNumber: number): Promise<void> {
        const byNumber = await this.databaseService.desk.findUnique({ where: { desk_number: deskNumber } });
        if (byNumber) {
            throw new ConflictException(`Desk with number ${deskNumber} already exists`);
        }
    }
}
