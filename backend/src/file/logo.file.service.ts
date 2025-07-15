import { BadRequestException, Injectable, Logger, NotFoundException, StreamableFile } from "@nestjs/common";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import * as fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";
import { Entity } from "src/auth/types/entity.class";
import { WebsocketsService } from "src/websockets/websockets.service";

@Injectable()
export class LogoFileService {
    constructor(private readonly websocketsService: WebsocketsService) {}

    readonly uploadsPath = process.env.UPLOADS_PATH || "./uploads";
    readonly logoFolder = "logo";
    readonly logoIDs = [1, 2];

    private logger = new Logger(LogoFileService.name);

    async getLogoAvailabilityInfo(): Promise<{ availableLogos: number[] }> {
        const availableLogos: number[] = [];

        this.logoIDs.map((id) => {
            const filePath = path.resolve(this.uploadsPath, this.logoFolder, `logo${id}.svg`);

            if (fsSync.existsSync(filePath)) {
                availableLogos.push(id);
            }
        });

        return { availableLogos: availableLogos };
    }

    async getLogo(id: number): Promise<StreamableFile> {
        if (!this.logoIDs.includes(id)) {
            this.logger.warn("Cannot fetch logo because of invalid id");
            throw new BadRequestException("Invalid id");
        }

        const filePath = path.resolve(this.uploadsPath, this.logoFolder, `logo${id}.svg`);

        if (!fsSync.existsSync(filePath)) {
            this.logger.warn("Cannot fetch logo because it doesn't exist");
            throw new NotFoundException("Logo doesn't exist");
        }

        const file = fsSync.createReadStream(filePath);
        this.logger.debug(`Fetched logo with id ${id}`);

        return new StreamableFile(file, {
            type: "image/svg+xml",
            disposition: `attachment; filename=logo${id}.svg`,
        });
    }

    async uploadLogo(file: Express.Multer.File, id: number, entity: Entity): Promise<{ message: string }> {
        if (!this.logoIDs.includes(id)) {
            this.logger.warn("Cannot upload new logo because of invalid id");
            throw new BadRequestException("Invalid id");
        }

        if (!file) {
            this.logger.warn("Cannot upload new logo because no file uploaded");
            throw new BadRequestException("No file uploaded");
        }

        if (!this.isSVG(file.buffer)) {
            this.logger.warn("Cannot upload new logo because of invalid file type");
            throw new BadRequestException("Invalid file type - SVG only");
        }

        this.logger.debug(`Saving ${path.resolve(this.uploadsPath, this.logoFolder, `logo${id}.svg`)}`);
        await fs.mkdir(path.resolve(this.uploadsPath, this.logoFolder), { recursive: true });
        await fs.writeFile(path.resolve(this.uploadsPath, this.logoFolder, `logo${id}.svg`), file.buffer);

        this.websocketsService.reloadFrontend();
        this.logger.log(`[${entity.name}] Uploaded new logo with id ${id}`);
        return { message: "Logo uploaded successfully" };
    }

    async deleteLogo(id: number, entity: Entity): Promise<{ message: string }> {
        if (!this.logoIDs.includes(id)) {
            this.logger.warn("Cannot delete logo because of invalid id");
            throw new BadRequestException("Invalid id");
        }

        const filePath = path.resolve(this.uploadsPath, this.logoFolder, `logo${id}.svg`);
        this.logger.debug(`Trying to delete ${filePath}`);

        // Check if file exists
        if (!fsSync.existsSync(filePath)) {
            this.logger.warn("Cannot delete logo because it doesn't exist");
            throw new NotFoundException("Logo doesn't exist");
        }

        await fs.unlink(filePath);
        this.websocketsService.reloadFrontend();
        this.logger.log(`[${entity.name}] Deleted logo with id ${id}`);
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
