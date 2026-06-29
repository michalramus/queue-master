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
import { LangCode } from "@prisma/client";
import { memoryStorage } from "multer";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { LogoFileService } from "./logo.file.service";
import { Entity } from "src/auth/types/entity.class";
import { LogoAvailabilityResponseDto } from "./dto/logo.dto";
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
import { MessageResponseDto } from "src/dto/messageResponse.dto";

const maxLogoSize = 1024 * 1024;

@ApiTags("file")
@Controller("file")
export class FileController {
    constructor(private readonly logoService: LogoFileService) {}

    @Get("logo")
    @ApiOperation({ summary: "Get logo availability information per language" })
    @ApiResponse({ status: 200, description: "Map of lang → available logo IDs", type: LogoAvailabilityResponseDto })
    async getLogoAvailabilityInfo(): Promise<LogoAvailabilityResponseDto> {
        const { availableLogos } = await this.logoService.getLogoAvailabilityInfo();
        return { availableLogos };
    }

    @Get("logo/:lang/:id")
    @ApiOperation({ summary: "Download logo file by language and ID" })
    @ApiParam({ name: "lang", description: "Language code", enum: LangCode })
    @ApiParam({ name: "id", description: "Logo ID", enum: LogoID })
    @ApiResponse({
        status: 200,
        description: "Logo file",
        content: {
            "image/*": {
                schema: { type: "string", format: "binary" },
            },
        },
    })
    async getLogo(
        @Param("lang", new ParseEnumPipe(LangCode)) lang: LangCode,
        @Param("id", new ParseEnumPipe(LogoID)) id: LogoID,
    ): Promise<StreamableFile> {
        return this.logoService.getLogo(lang, id);
    }

    @Post("logo/:lang/:id")
    @UseInterceptors(FileInterceptor("file", { storage: memoryStorage(), limits: { fileSize: maxLogoSize } }))
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Upload logo file for a specific language" })
    @ApiParam({ name: "lang", description: "Language code", enum: LangCode })
    @ApiParam({ name: "id", description: "Logo ID", enum: LogoID })
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        description: "Upload logo file",
        required: true,
        schema: {
            type: "object",
            properties: {
                file: { type: "string", format: "binary" },
            },
        },
    })
    @ApiResponse({ status: 201, description: "Logo uploaded successfully", type: MessageResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Admin role required" })
    // @ApiBearerAuth("JWT-auth")
    async uploadLogo(
        @UploadedFile() file: Express.Multer.File,
        @Param("lang", new ParseEnumPipe(LangCode)) lang: LangCode,
        @Param("id", new ParseEnumPipe(LogoID)) id: LogoID,
        @Req() req: any,
    ): Promise<MessageResponseDto> {
        return this.logoService.uploadLogo(file, lang, id, Entity.convertFromReq(req));
    }

    @Delete("logo/:lang/:id")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Delete logo file for a specific language" })
    @ApiParam({ name: "lang", description: "Language code", enum: LangCode })
    @ApiParam({ name: "id", description: "Logo ID", enum: LogoID })
    @ApiResponse({ status: 200, description: "Logo deleted", type: MessageResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Admin role required" })
    // @ApiBearerAuth("JWT-auth")
    async deleteLogo(
        @Param("lang", new ParseEnumPipe(LangCode)) lang: LangCode,
        @Param("id", new ParseEnumPipe(LogoID)) id: LogoID,
        @Req() req: any,
    ): Promise<MessageResponseDto> {
        return this.logoService.deleteLogo(lang, id, Entity.convertFromReq(req));
    }
}
