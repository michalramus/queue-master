import { Module } from "@nestjs/common";
import { OpeningHoursController } from "./opening-hours.controller";
import { OpeningHoursService } from "./opening-hours.service";
import { DatabaseModule } from "../database/database.module";
import { SseModule } from "../sse/sse.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [DatabaseModule, SseModule, AuthModule],
    controllers: [OpeningHoursController],
    providers: [OpeningHoursService],
    exports: [OpeningHoursService],
})
export class OpeningHoursModule {}
