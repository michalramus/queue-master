import { BadRequestException, Injectable, Logger, NotFoundException, StreamableFile } from "@nestjs/common";
import { LangCode } from "@prisma/client";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import * as fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";
import { Entity } from "src/auth/types/entity.class";
import { SseService } from "src/sse/sse.service";
import { sseEvents } from "src/sse/sseEvents.enum";
import { LogoID } from "./types/logoID.enum";

@Injectable()
export class LogoFileService {
    constructor(private readonly sseService: SseService) {}

    readonly uploadsPath = process.env.UPLOADS_PATH || "./uploads";
    readonly logoFolder = "logo";

    private logger = new Logger(LogoFileService.name);

    async getLogoAvailabilityInfo(): Promise<{ availableLogos: Record<LangCode, LogoID[]> }> {
        const availableLogos: Record<LangCode, LogoID[]> = {} as Record<LangCode, LogoID[]>;

        for (const lang of Object.values(LangCode)) {
            const langDir = path.resolve(this.uploadsPath, this.logoFolder, lang);
            const available: LogoID[] = [];

            for (const id of Object.values(LogoID)) {
                const filePath = path.resolve(langDir, `${id}.svg`);
                if (fsSync.existsSync(filePath)) {
                    available.push(id);
                }
            }

            availableLogos[lang] = available;
        }

        return { availableLogos };
    }

    async getLogo(lang: LangCode, id: LogoID): Promise<StreamableFile> {
        const filePath = path.resolve(this.uploadsPath, this.logoFolder, lang, `${id}.svg`);

        if (!fsSync.existsSync(filePath)) {
            this.logger.warn(`Cannot fetch logo ${id} for lang ${lang} because it doesn't exist`);
            throw new NotFoundException("Logo doesn't exist");
        }

        const file = fsSync.createReadStream(filePath);
        this.logger.debug(`Fetched logo ${id} for lang ${lang}`);

        return new StreamableFile(file, {
            type: "image/svg+xml",
            disposition: `attachment; filename=${id}.svg`,
        });
    }

    async uploadLogo(
        file: Express.Multer.File,
        lang: LangCode,
        id: LogoID,
        entity: Entity,
    ): Promise<{ message: string }> {
        if (!file) {
            this.logger.warn("Cannot upload new logo because no file uploaded");
            throw new BadRequestException("No file uploaded");
        }

        if (!this.isSVG(file.buffer)) {
            this.logger.warn("Cannot upload new logo because of invalid file type");
            throw new BadRequestException("Invalid file type - SVG only");
        }

        const langDir = path.resolve(this.uploadsPath, this.logoFolder, lang);
        const filePath = path.resolve(langDir, `${id}.svg`);
        this.logger.debug(`Saving ${filePath}`);
        await fs.mkdir(langDir, { recursive: true });
        await fs.writeFile(filePath, file.buffer);

        this.sseService.emit(sseEvents.LogoAvailabilityChanged, null);
        this.logger.log(`[${entity.name}] Uploaded logo ${id} for lang ${lang}`);
        return { message: "Logo uploaded successfully" };
    }

    async deleteLogo(lang: LangCode, id: LogoID, entity: Entity): Promise<{ message: string }> {
        const filePath = path.resolve(this.uploadsPath, this.logoFolder, lang, `${id}.svg`);
        this.logger.debug(`Trying to delete ${filePath}`);

        if (!fsSync.existsSync(filePath)) {
            this.logger.warn("Cannot delete logo because it doesn't exist");
            throw new NotFoundException("Logo doesn't exist");
        }

        await fs.unlink(filePath);
        this.sseService.emit(sseEvents.LogoAvailabilityChanged, null);
        this.logger.log(`[${entity.name}] Deleted logo ${id} for lang ${lang}`);
        return { message: "Logo deleted successfully" };
    }

    private isSVG(fileBuffer: Buffer): boolean {
        const fileContent = fileBuffer.toString("utf8").trim();

        if (fileContent.length === 0) {
            return false;
        }

        if (XMLValidator.validate(fileContent) !== true) {
            return false;
        }

        let jsonObject;
        const parser = new XMLParser();

        try {
            jsonObject = parser.parse(fileContent);
        } catch {
            return false;
        }

        if (!jsonObject) {
            return false;
        }

        if (!Object.keys(jsonObject).some((x) => x.toLowerCase() === "svg")) {
            return false;
        }

        return true;
    }
}
