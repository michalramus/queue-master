import { Module } from "@nestjs/common";
import { UserSettingsService } from "./user-settings.service";
import { UserSettingsController } from "./user-settings.controller";
import { DatabaseModule } from "../database/database.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [DatabaseModule, AuthModule],
    controllers: [UserSettingsController],
    providers: [UserSettingsService],
})
export class UserSettingsModule {}
