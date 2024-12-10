import {
    Controller,
    Post,
    Get,
    Delete,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Param,
    ParseIntPipe,
    Req,
    StreamableFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { LogoFileService } from "./logo.file.service";
import { Entity } from "src/auth/types/entity.class";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";

//max sizes
const maxLogoSize = 1024 * 1024;

@Controller("file")
export class FileController {
    constructor(private readonly logoService: LogoFileService) {}

    @Get("logo")
    @ApiBody({
        description: "Get IDs of logos which can be fetched",
    })
    async getLogoAvailabilityInfo() {
        return this.logoService.getLogoAvailabilityInfo();
    }

    @Get("logo/:id")
    async getLogo(@Param("id", new ParseIntPipe()) id: number): Promise<StreamableFile> {
        return this.logoService.getLogo(id);
    }

    @Post("logo/:id")
    @UseInterceptors(FileInterceptor("file", { storage: memoryStorage(), limits: { fileSize: maxLogoSize } }))
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        description: "Upload logo file",
        type: "multipart/form-data",
        required: true,
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    })
    async uploadLogo(
        @UploadedFile()
        file: Express.Multer.File,
        @Param("id", new ParseIntPipe()) id: number,
        @Req() req: any,
    ): Promise<{ message: string }> {
        return this.logoService.uploadLogo(file, id, Entity.convertFromReq(req));
    }

    @Delete("logo/:id")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deleteLogo(@Param("id", new ParseIntPipe()) id: number, @Req() req: any): Promise<{ message: string }> {
        return this.logoService.deleteLogo(id, Entity.convertFromReq(req));
    }
}
