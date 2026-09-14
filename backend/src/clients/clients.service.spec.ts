import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { LangCode } from "@prisma/client";
import { ClientsService } from "./clients.service";
import { DatabaseService } from "src/database/database.service";
import { SseService } from "../sse/sse.service";
import { MultilingualTextService } from "src/multilingual-text/multilingual-text.service";
import { Entity } from "src/auth/types/entity.class";

describe("ClientsService", () => {
    let service: ClientsService;
    let databaseService: {
        category: { findUnique: jest.Mock; update: jest.Mock };
        client: { create: jest.Mock; findFirst: jest.Mock; count: jest.Mock };
        $transaction: jest.Mock;
    };

    const entity = new Entity(1, "Device", "kiosk");

    beforeEach(async () => {
        databaseService = {
            category: { findUnique: jest.fn(), update: jest.fn() },
            client: { create: jest.fn(), findFirst: jest.fn(), count: jest.fn() },
            $transaction: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ClientsService,
                { provide: DatabaseService, useValue: databaseService },
                { provide: SseService, useValue: { emit: jest.fn() } },
                {
                    provide: MultilingualTextService,
                    useValue: { getMultilingualText: jest.fn().mockResolvedValue({ en: "Category A" }) },
                },
            ],
        }).compile();

        service = module.get<ClientsService>(ClientsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        const dto = { categoryId: 1, language: LangCode.en };

        it("throws BadRequestException and creates nothing when the category is disabled", async () => {
            databaseService.category.findUnique.mockResolvedValue({ short_name: "A", is_enabled: false });

            await expect(service.create(dto, entity)).rejects.toThrow(BadRequestException);
            expect(databaseService.$transaction).not.toHaveBeenCalled();
            expect(databaseService.category.update).not.toHaveBeenCalled();
            expect(databaseService.client.create).not.toHaveBeenCalled();
        });

        it("throws NotFoundException when the category does not exist", async () => {
            databaseService.category.findUnique.mockResolvedValue(null);

            await expect(service.create(dto, entity)).rejects.toThrow(NotFoundException);
            expect(databaseService.$transaction).not.toHaveBeenCalled();
        });
    });
});
