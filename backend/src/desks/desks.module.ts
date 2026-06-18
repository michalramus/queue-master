import { Module } from "@nestjs/common";
import { DesksService } from "./desks.service";
import { DesksController } from "./desks.controller";
import { DatabaseModule } from "src/database/database.module";
import { AuthModule } from "src/auth/auth.module";
import { SseModule } from "src/sse/sse.module";

@Module({
    imports: [DatabaseModule, AuthModule, SseModule],
    controllers: [DesksController],
    providers: [DesksService],
    exports: [DesksService],
})
export class DesksModule {}
