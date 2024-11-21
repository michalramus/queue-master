import { Module } from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { ClientsController } from "./clients.controller";
import { DatabaseModule } from "src/database/database.module";
import { WebsocketsModule } from "src/websockets/websockets.module";
import { AuthModule } from "src/auth/auth.module";
import { MultilingualTextModule } from "src/multilingual-text/multilingual-text.module";

@Module({
    imports: [DatabaseModule, WebsocketsModule, AuthModule, MultilingualTextModule],
    controllers: [ClientsController],
    providers: [ClientsService],
})
export class ClientsModule {}
