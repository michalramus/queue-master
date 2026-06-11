import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { SeedingService } from "./seeding.service";

@Module({
    imports: [UsersModule],
    providers: [SeedingService],
})
export class SeedingModule {}
