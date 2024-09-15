import { Module } from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { ClientsController } from "./clients.controller";
import { DatabaseModule } from "src/database/database.module";
import { WebsocketsModule } from "src/websockets/websockets.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [DatabaseModule, WebsocketsModule, AuthModule],
    controllers: [ClientsController],
    providers: [ClientsService],
})
export class ClientsModule {}
