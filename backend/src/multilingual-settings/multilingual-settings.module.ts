import { Module } from "@nestjs/common";
import { MultilingualSettingsController } from "./multilingual-settings.controller";
import { MultilingualSettingsService } from "./multilingual-settings.service";
import { MultilingualTextModule } from "../multilingual-text/multilingual-text.module";
import { SseModule } from "../sse/sse.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [MultilingualTextModule, SseModule, AuthModule],
    controllers: [MultilingualSettingsController],
    providers: [MultilingualSettingsService],
    exports: [MultilingualSettingsService],
})
export class MultilingualSettingsModule {}
