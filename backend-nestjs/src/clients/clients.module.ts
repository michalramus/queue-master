import { Module } from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { ClientsController } from "./clients.controller";
import { DatabaseModule } from "src/database/database.module";
import { WebsocketsModule } from "src/websockets/websockets.module";

@Module({
    imports: [DatabaseModule, WebsocketsModule],
    controllers: [ClientsController],
    providers: [ClientsService],
})
export class ClientsModule {}
