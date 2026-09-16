import { BadRequestException, NotFoundException } from "@nestjs/common";
import { LangCode } from "@prisma/client";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { SseService } from "src/sse/sse.service";
import { sseEvents } from "src/sse/sseEvents.enum";
import { Entity } from "src/auth/types/entity.class";
import { LogoFileService } from "./logo.file.service";
import { LogoID } from "./types/logoID.enum";

describe("LogoFileService", () => {
    let tmpDir: string;
    let service: LogoFileService;
    let sseService: { emit: jest.Mock };

    const entity = new Entity(1, "User", "tester");

    /** Minimal multer file - only `buffer` is read by the service */
    function fileWith(content: string): Express.Multer.File {
        return { buffer: Buffer.from(content, "utf8") } as Express.Multer.File;
    }

    function uploadedPath(lang: LangCode, id: LogoID): string {
        return path.resolve(tmpDir, "logo", lang, `${id}.svg`);
    }

    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "qm-logo-"));
        // Read in the service's field initialiser, so it must be set before constructing
        process.env.UPLOADS_PATH = tmpDir;

        sseService = { emit: jest.fn() };
        service = new LogoFileService(sseService as unknown as SseService);
    });

    afterEach(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
        delete process.env.UPLOADS_PATH;
    });

    describe("uploadLogo", () => {
        it("stores a valid SVG and announces the change", async () => {
            const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1"/></svg>';

            await service.uploadLogo(fileWith(svg), LangCode.en, LogoID.logo_kiosk_main, entity);

            expect(fs.readFileSync(uploadedPath(LangCode.en, LogoID.logo_kiosk_main), "utf8")).toBe(svg);
            expect(sseService.emit).toHaveBeenCalledWith(sseEvents.LogoAvailabilityChanged, null);
        });

        it("rejects a request with no file", async () => {
            await expect(
                service.uploadLogo(
                    undefined as unknown as Express.Multer.File,
                    LangCode.en,
                    LogoID.logo_kiosk_main,
                    entity,
                ),
            ).rejects.toThrow(BadRequestException);
        });

        it.each([
            ["plain text", "not an svg at all"],
            ["empty content", "   "],
            ["malformed XML", "<svg><rect></svg>"],
            ["well-formed XML that is not an SVG", "<html><body>hi</body></html>"],
        ])("rejects %s without writing a file", async (_label, content) => {
            await expect(
                service.uploadLogo(fileWith(content), LangCode.en, LogoID.logo_kiosk_main, entity),
            ).rejects.toThrow(BadRequestException);

            expect(fs.existsSync(uploadedPath(LangCode.en, LogoID.logo_kiosk_main))).toBe(false);
            expect(sseService.emit).not.toHaveBeenCalled();
        });

        it("overwrites an existing logo for the same lang and id", async () => {
            const first = "<svg>first</svg>";
            const second = "<svg>second</svg>";

            await service.uploadLogo(fileWith(first), LangCode.en, LogoID.logo_tv_main, entity);
            await service.uploadLogo(fileWith(second), LangCode.en, LogoID.logo_tv_main, entity);

            expect(fs.readFileSync(uploadedPath(LangCode.en, LogoID.logo_tv_main), "utf8")).toBe(second);
        });
    });

    describe("getLogoAvailabilityInfo", () => {
        it("reports every language, listing only the logos present", async () => {
            await service.uploadLogo(fileWith("<svg/>"), LangCode.en, LogoID.logo_kiosk_main, entity);
            await service.uploadLogo(fileWith("<svg/>"), LangCode.pl, LogoID.logo_tv_secondary, entity);

            const { availableLogos } = await service.getLogoAvailabilityInfo();

            expect(availableLogos[LangCode.en]).toEqual([LogoID.logo_kiosk_main]);
            expect(availableLogos[LangCode.pl]).toEqual([LogoID.logo_tv_secondary]);
        });

        it("returns an empty list per language when nothing was uploaded", async () => {
            const { availableLogos } = await service.getLogoAvailabilityInfo();

            for (const lang of Object.values(LangCode)) {
                expect(availableLogos[lang]).toEqual([]);
            }
        });
    });

    describe("getLogo", () => {
        it("throws when the logo does not exist", async () => {
            await expect(service.getLogo(LangCode.en, LogoID.logo_kiosk_main)).rejects.toThrow(NotFoundException);
        });

        it("streams an uploaded logo", async () => {
            const svg = '<svg id="streamed"/>';
            await service.uploadLogo(fileWith(svg), LangCode.en, LogoID.logo_kiosk_main, entity);

            const streamable = await service.getLogo(LangCode.en, LogoID.logo_kiosk_main);

            expect(streamable.options.type).toBe("image/svg+xml");
            expect(streamable.options.disposition).toContain(`${LogoID.logo_kiosk_main}.svg`);

            // Drain it here rather than leaving it dangling: the read stream opens lazily, so an
            // unconsumed one opens after afterEach has removed tmpDir and the ENOENT then surfaces
            // against whichever test is running next.
            const chunks: Buffer[] = [];
            for await (const chunk of streamable.getStream()) {
                chunks.push(Buffer.from(chunk));
            }
            expect(Buffer.concat(chunks).toString("utf8")).toBe(svg);
        });
    });

    describe("deleteLogo", () => {
        it("removes the file and announces the change", async () => {
            await service.uploadLogo(fileWith("<svg/>"), LangCode.en, LogoID.logo_kiosk_main, entity);
            sseService.emit.mockClear();

            await service.deleteLogo(LangCode.en, LogoID.logo_kiosk_main, entity);

            expect(fs.existsSync(uploadedPath(LangCode.en, LogoID.logo_kiosk_main))).toBe(false);
            expect(sseService.emit).toHaveBeenCalledWith(sseEvents.LogoAvailabilityChanged, null);
        });

        it("throws when the logo does not exist", async () => {
            await expect(service.deleteLogo(LangCode.en, LogoID.logo_kiosk_main, entity)).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});
