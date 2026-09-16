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
    let transactionClient: {
        category: { findUnique: jest.Mock; update: jest.Mock };
        client: { create: jest.Mock };
    };
    let databaseService: {
        category: { findUnique: jest.Mock; update: jest.Mock };
        client: {
            create: jest.Mock;
            findFirst: jest.Mock;
            findMany: jest.Mock;
            count: jest.Mock;
            deleteMany: jest.Mock;
        };
        $transaction: jest.Mock;
    };

    const entity = new Entity(1, "Device", "kiosk");

    beforeEach(async () => {
        transactionClient = {
            category: { findUnique: jest.fn(), update: jest.fn() },
            client: { create: jest.fn() },
        };

        databaseService = {
            category: { findUnique: jest.fn(), update: jest.fn() },
            client: {
                create: jest.fn(),
                findFirst: jest.fn(),
                findMany: jest.fn().mockResolvedValue([]),
                count: jest.fn().mockResolvedValue(0),
                deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
            },
            $transaction: jest.fn().mockImplementation((callback) => callback(transactionClient)),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ClientsService,
                { provide: DatabaseService, useValue: databaseService },
                { provide: SseService, useValue: { emit: jest.fn() } },
                {
                    provide: MultilingualTextService,
                    useValue: {
                        getMultilingualText: jest.fn().mockResolvedValue({ en: "Category A" }),
                        getMultilingualTextForKeys: jest.fn().mockResolvedValue(new Map()),
                    },
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
            // last_counter_reset is recent so the counter reset is skipped
            const disabledCategory = {
                id: 1,
                short_name: "A",
                is_enabled: false,
                counter: 5,
                last_counter_reset: new Date(),
            };
            databaseService.category.findUnique.mockResolvedValue(disabledCategory);
            transactionClient.category.findUnique.mockResolvedValue(disabledCategory);

            await expect(service.create(dto, entity)).rejects.toThrow(BadRequestException);
            expect(transactionClient.category.update).not.toHaveBeenCalled();
            expect(transactionClient.client.create).not.toHaveBeenCalled();
        });

        it("throws NotFoundException when the category does not exist", async () => {
            databaseService.category.findUnique.mockResolvedValue(null);
            transactionClient.category.findUnique.mockResolvedValue(null);

            await expect(service.create(dto, entity)).rejects.toThrow(NotFoundException);
            expect(transactionClient.client.create).not.toHaveBeenCalled();
        });
    });
});
