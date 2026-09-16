import { Test, TestingModule } from "@nestjs/testing";
import { Category_Short_Name } from "@prisma/client";
import { CategoriesService } from "./categories.service";
import { DatabaseService } from "../database/database.service";
import { MultilingualTextService } from "src/multilingual-text/multilingual-text.service";
import { SseService } from "src/sse/sse.service";
import { ClientsService } from "src/clients/clients.service";
import { Entity } from "../auth/types/entity.class";

describe("CategoriesService", () => {
    let service: CategoriesService;
    let databaseService: {
        category: {
            findMany: jest.Mock;
            findUnique: jest.Mock;
            create: jest.Mock;
            update: jest.Mock;
        };
    };

    const entity = new Entity(1, "User", "tester");

    beforeEach(async () => {
        databaseService = {
            category: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoriesService,
                { provide: DatabaseService, useValue: databaseService },
                {
                    provide: MultilingualTextService,
                    useValue: {
                        getMultilingualText: jest.fn().mockResolvedValue({ en: "Category A" }),
                        updateMultilingualText: jest.fn(),
                        deleteMultilingualText: jest.fn(),
                    },
                },
                { provide: SseService, useValue: { emit: jest.fn() } },
                { provide: ClientsService, useValue: { removeAllFromCategory: jest.fn() } },
            ],
        }).compile();

        service = module.get<CategoriesService>(CategoriesService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findAll", () => {
        it("returns disabled categories as well", async () => {
            databaseService.category.findMany.mockResolvedValue([
                { id: 1, short_name: "A", is_enabled: true, categories_desks: [] },
                { id: 2, short_name: "B", is_enabled: false, categories_desks: [] },
            ]);

            const categories = await service.findAll();

            expect(categories).toHaveLength(2);
            expect(categories[0].is_enabled).toBe(true);
            expect(categories[1].is_enabled).toBe(false);
        });
    });

    describe("create", () => {
        it("defaults is_enabled to true when not provided", async () => {
            databaseService.category.findUnique.mockResolvedValue(null);
            databaseService.category.create.mockResolvedValue({ id: 1, short_name: "A", is_enabled: true });

            const category = await service.create(
                { short_name: Category_Short_Name.A, name: { en: "Category A" } },
                entity,
            );

            expect(databaseService.category.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ is_enabled: true }) }),
            );
            expect(category.is_enabled).toBe(true);
        });

        it("persists is_enabled when provided", async () => {
            databaseService.category.findUnique.mockResolvedValue(null);
            databaseService.category.create.mockResolvedValue({ id: 1, short_name: "A", is_enabled: false });

            const category = await service.create(
                { short_name: Category_Short_Name.A, name: { en: "Category A" }, is_enabled: false },
                entity,
            );

            expect(databaseService.category.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ is_enabled: false }) }),
            );
            expect(category.is_enabled).toBe(false);
        });
    });

    describe("update", () => {
        it("updates is_enabled without touching short_name", async () => {
            databaseService.category.findUnique
                .mockResolvedValueOnce({ id: 1, short_name: "A", is_enabled: true })
                .mockResolvedValueOnce({ id: 1, short_name: "A", is_enabled: false, categories_desks: [] });

            const category = await service.update(1, { is_enabled: false }, entity);

            expect(databaseService.category.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { short_name: undefined, is_enabled: false },
            });
            expect(category.is_enabled).toBe(false);
        });

        it("does not update the category row when only the name changes", async () => {
            databaseService.category.findUnique
                .mockResolvedValueOnce({ id: 1, short_name: "A", is_enabled: true })
                .mockResolvedValueOnce({ id: 1, short_name: "A", is_enabled: true, categories_desks: [] });

            await service.update(1, { name: { en: "Renamed" } }, entity);

            expect(databaseService.category.update).not.toHaveBeenCalled();
        });
    });
});
