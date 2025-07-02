import { Module } from "@nestjs/common";
import { UserSettingsService } from "./user-settings.service";
import { UserSettingsController } from "./user-settings.controller";
import { DatabaseModule } from "../database/database.module";
import { AuthModule } from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [DatabaseModule, AuthModule, UsersModule],
    controllers: [UserSettingsController],
    providers: [UserSettingsService],
})
export class UserSettingsModule {}
