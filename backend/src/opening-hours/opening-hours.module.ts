import { Module } from "@nestjs/common";
import { OpeningHoursController } from "./opening-hours.controller";
import { OpeningHoursService } from "./opening-hours.service";
import { DatabaseModule } from "../database/database.module";
import { WebsocketsModule } from "../websockets/websockets.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [DatabaseModule, WebsocketsModule, AuthModule],
    controllers: [OpeningHoursController],
    providers: [OpeningHoursService],
    exports: [OpeningHoursService],
})
export class OpeningHoursModule {}
