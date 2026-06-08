import { Module } from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { ClientsController } from "./clients.controller";
import { DatabaseModule } from "src/database/database.module";
import { SseModule } from "src/sse/sse.module";
import { AuthModule } from "src/auth/auth.module";
import { MultilingualTextModule } from "src/multilingual-text/multilingual-text.module";

@Module({
    imports: [DatabaseModule, SseModule, AuthModule, MultilingualTextModule],
    controllers: [ClientsController],
    providers: [ClientsService],
    exports: [ClientsService],
})
export class ClientsModule {}
