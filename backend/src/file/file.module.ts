import { Module } from "@nestjs/common";
import { LogoFileService } from "./logo.file.service";
import { FileController } from "./file.controller";
import { AuthModule } from "src/auth/auth.module";
import { WebsocketsModule } from "src/websockets/websockets.module";

@Module({
    imports: [AuthModule, WebsocketsModule],
    providers: [LogoFileService],
    controllers: [FileController],
})
export class FileModule {}
