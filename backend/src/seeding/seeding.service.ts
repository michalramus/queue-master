import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { randomBytes } from "crypto";
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
        const password = process.env.SEED_ADMIN_PASSWORD ?? randomBytes(16).toString("hex");

        await this.usersService.create({ username, password, role: UserRole.Admin }, SYSTEM_ENTITY);

        if (!process.env.SEED_ADMIN_PASSWORD) {
            this.logger.warn(`========================================================`);
            this.logger.warn(`SEED_ADMIN_PASSWORD was not set. A random password has`);
            this.logger.warn(`been generated for the initial admin account.`);
            this.logger.warn(`  Username: ${username}`);
            this.logger.warn(`  Password: ${password}`);
            this.logger.warn(`Save this password now — it will NOT be shown again.`);
            this.logger.warn(`========================================================`);
        } else {
            this.logger.log(`Seeded admin user: ${username}`);
        }
    }
}
