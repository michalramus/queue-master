import { Module } from "@nestjs/common";
import { LogoFileService } from "./logo.file.service";
import { FileController } from "./file.controller";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [AuthModule],
    providers: [LogoFileService],
    controllers: [FileController],
})
export class FileModule {}
