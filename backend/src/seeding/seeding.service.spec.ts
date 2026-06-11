import { jest } from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import { SeedingService } from "./seeding.service";
import { UsersService } from "../users/users.service";
import { UserCreateDto, UserResponseDto } from "../users/dto/user.dto";
import { Entity } from "../auth/types/entity.class";
import { UserRole } from "@prisma/client";

const mockUsersService = {
    findAll: jest.fn<() => Promise<UserResponseDto[]>>(),
    create: jest.fn<(dto: UserCreateDto, entity: Entity) => Promise<UserResponseDto>>(),
};

describe("SeedingService", () => {
    let service: SeedingService;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [SeedingService, { provide: UsersService, useValue: mockUsersService }],
        }).compile();

        service = module.get<SeedingService>(SeedingService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("skips seeding when users exist", async () => {
        mockUsersService.findAll.mockResolvedValue([{ id: 1, username: "existing", role: UserRole.Admin }]);

        await service.onApplicationBootstrap();

        expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it("creates admin user when no users exist", async () => {
        mockUsersService.findAll.mockResolvedValue([]);
        mockUsersService.create.mockResolvedValue({ id: 1, username: "admin", role: UserRole.Admin });

        await service.onApplicationBootstrap();

        expect(mockUsersService.create).toHaveBeenCalledOnce();
        const [dto, entity] = mockUsersService.create.mock.calls[0];
        expect(dto.username).toBe("admin");
        expect(dto.password).toBe("admin");
        expect(dto.role).toBe(UserRole.Admin);
        expect(entity.name).toBe("system");
    });

    it("uses env vars for credentials when set", async () => {
        process.env.SEED_ADMIN_USERNAME = "superadmin";
        process.env.SEED_ADMIN_PASSWORD = "supersecret";
        mockUsersService.findAll.mockResolvedValue([]);
        mockUsersService.create.mockResolvedValue({ id: 1, username: "superadmin", role: UserRole.Admin });

        await service.onApplicationBootstrap();

        const [dto] = mockUsersService.create.mock.calls[0];
        expect(dto.username).toBe("superadmin");
        expect(dto.password).toBe("supersecret");

        delete process.env.SEED_ADMIN_USERNAME;
        delete process.env.SEED_ADMIN_PASSWORD;
    });
});
