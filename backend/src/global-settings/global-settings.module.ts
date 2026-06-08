import { Module } from "@nestjs/common";
import { GlobalSettingsService } from "./global-settings.service";
import { GlobalSettingsController } from "./global-settings.controller";
import { DatabaseModule } from "../database/database.module";
import { AuthModule } from "src/auth/auth.module";
import { SseModule } from "src/sse/sse.module";

@Module({
    imports: [DatabaseModule, AuthModule, SseModule],
    controllers: [GlobalSettingsController],
    providers: [GlobalSettingsService],
})
export class GlobalSettingsModule {}
