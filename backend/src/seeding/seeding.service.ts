import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { Entity } from "../auth/types/entity.class";
import { UserRole } from "@prisma/client";

const SYSTEM_ENTITY = new Entity(0, "User", "system");

@Injectable()
export class SeedingService implements OnApplicationBootstrap {
    private readonly logger = new Logger(SeedingService.name);

    constructor(private readonly usersService: UsersService) {}

    async onApplicationBootstrap(): Promise<void> {
        const users = await this.usersService.findAll();

        if (users.length > 0) {
            this.logger.log("Users exist, skipping seed");
            return;
        }

        const username = process.env.SEED_ADMIN_USERNAME ?? "admin";
        const password = process.env.SEED_ADMIN_PASSWORD ?? "admin";

        await this.usersService.create({ username, password, role: UserRole.Admin }, SYSTEM_ENTITY);

        this.logger.log(`Seeded admin user: ${username}`);
    }
}
