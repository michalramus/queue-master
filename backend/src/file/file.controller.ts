import {
    Controller,
    Post,
    Get,
    Delete,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Param,
    Req,
    StreamableFile,
    ParseEnumPipe,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { LogoFileService } from "./logo.file.service";
import { Entity } from "src/auth/types/entity.class";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
    ApiConsumes,
    // ApiBearerAuth,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
} from "@nestjs/swagger";
import { LogoID } from "./types/logoID.enum";

//max sizes
const maxLogoSize = 1024 * 1024;

@ApiTags("file")
@Controller("file")
export class FileController {
    constructor(private readonly logoService: LogoFileService) {}

    @Get("logo")
    @ApiOperation({ summary: "Get available logo information" })
    @ApiResponse({ status: 200, description: "IDs of available logos" })
    async getLogoAvailabilityInfo(): Promise<{
        availableLogos: LogoID[];
    }> {
        return this.logoService.getLogoAvailabilityInfo();
    }

    @Get("logo/:id")
    @ApiOperation({ summary: "Download logo file by ID" })
    @ApiParam({ name: "id", description: "Logo ID", enum: LogoID })
    @ApiResponse({ status: 200, description: "Logo file", schema: { type: "string", format: "binary" } })
    async getLogo(@Param("id", new ParseEnumPipe(LogoID)) id: LogoID): Promise<StreamableFile> {
        return this.logoService.getLogo(id);
    }

    @Post("logo/:id")
    @UseInterceptors(FileInterceptor("file", { storage: memoryStorage(), limits: { fileSize: maxLogoSize } }))
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Upload logo file" })
    @ApiParam({ name: "id", description: "Logo ID", enum: LogoID })
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        description: "Upload logo file",
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
    @ApiResponse({ status: 201, description: "Logo uploaded successfully" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden - Admin role required" })
    // @ApiBearerAuth("JWT-auth")
    async uploadLogo(
        @UploadedFile()
        file: Express.Multer.File,
        @Param("id", new ParseEnumPipe(LogoID)) id: LogoID,
        @Req() req: any,
    ): Promise<{ message: string }> {
        return this.logoService.uploadLogo(file, id, Entity.convertFromReq(req));
    }

    @Delete("logo/:id")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Delete logo file" })
    @ApiParam({ name: "id", description: "Logo ID", enum: LogoID })
    @ApiResponse({ status: 200, description: "Logo deleted successfully" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden - Admin role required" })
    // @ApiBearerAuth("JWT-auth")
    async deleteLogo(
        @Param("id", new ParseEnumPipe(LogoID)) id: LogoID,
        @Req() req: any,
    ): Promise<{ message: string }> {
        return this.logoService.deleteLogo(id, Entity.convertFromReq(req));
    }
}
