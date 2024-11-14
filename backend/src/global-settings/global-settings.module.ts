import { Module } from "@nestjs/common";
import { GlobalSettingsService } from "./global-settings.service";
import { GlobalSettingsController } from "./global-settings.controller";
import { DatabaseModule } from "../database/database.module";
import { AuthModule } from "src/auth/auth.module";
import { WebsocketsModule } from "src/websockets/websockets.module";

@Module({
    imports: [DatabaseModule, AuthModule, WebsocketsModule],
    controllers: [GlobalSettingsController],
    providers: [GlobalSettingsService],
})
export class GlobalSettingsModule {}
