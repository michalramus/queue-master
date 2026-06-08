import { Module } from "@nestjs/common";
import { LogoFileService } from "./logo.file.service";
import { FileController } from "./file.controller";
import { AuthModule } from "src/auth/auth.module";
import { SseModule } from "src/sse/sse.module";

@Module({
    imports: [AuthModule, SseModule],
    providers: [LogoFileService],
    controllers: [FileController],
})
export class FileModule {}
