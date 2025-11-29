import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { MultilingualTextService } from "../multilingual-text/multilingual-text.service";
import { ModuleNameMultilingualText } from "../multilingual-text/types/multilingualTextCategories.enum";
import { SseService } from "../sse/sse.service";
import { sseEvents } from "../sse/sseEvents.enum";
import { MultilingualSettingsInterface } from "./types/multilingual-settings.interface";
import { MultilingualSettings, MultilingualSettingKeyNames } from "./types/multilingual-settings.list";
import { Entity } from "../auth/types/entity.class";
import { LangCode } from "@prisma/client";

@Injectable()
export class MultilingualSettingsService {
    constructor(
        private readonly multilingualTextService: MultilingualTextService,
        private readonly sseService: SseService,
    ) {}

    private logger = new Logger(MultilingualSettingsService.name);

    async findAll(): Promise<MultilingualSettingsInterface> {
        const settings: MultilingualSettingsInterface = {};

        // Dynamically fetch all settings based on enum
        const settingNames = Object.keys(MultilingualSettings).filter((key) => isNaN(Number(key)));

        for (const settingName of settingNames) {
            const keyValue: number = MultilingualSettings[settingName];
            const translations = await this.multilingualTextService.getMultilingualText(
                ModuleNameMultilingualText.multilingual_settings,
                keyValue,
            );
            settings[settingName as MultilingualSettingKeyNames] = translations;
        }

        this.logger.debug("Retrieved multilingual settings");
        return settings;
    }

    async update(
        settings: Partial<MultilingualSettingsInterface>,
        entity: Entity,
    ): Promise<MultilingualSettingsInterface> {
        // Validate that only known properties are being updated
        const validKeys = Object.keys(MultilingualSettings).filter((key) => isNaN(Number(key)));
        const providedKeys = Object.keys(settings);
        const invalidKeys = providedKeys.filter((key) => !validKeys.includes(key));

        if (invalidKeys.length > 0) {
            throw new BadRequestException(`Invalid setting keys: ${invalidKeys.join(", ")}`);
        }

        const validLangs = Object.keys(LangCode);

        for (const [propertyName, languageValues] of Object.entries(settings)) {
            if (!languageValues) continue;

            const invalidLangs = Object.keys(languageValues).filter((lang) => !validLangs.includes(lang));

            if (invalidLangs.length > 0) {
                throw new BadRequestException(
                    `Invalid language codes for setting ${propertyName}: ${invalidLangs.join(", ")}`,
                );
            }
        }

        // Process each provided setting
        for (const [propertyName, languageValues] of Object.entries(settings)) {
            if (!languageValues) continue;

            const keyValue = MultilingualSettings[propertyName];
            const updates: { [lang: string]: string } = {};
            const deletions: string[] = [];

            // Separate updates and deletions
            Object.entries(languageValues).forEach(([lang, value]) => {
                if (value === "" || value === null) {
                    deletions.push(lang);
                } else if (typeof value === "string") {
                    updates[lang] = value;
                }
            });

            // Update non-empty values
            if (Object.keys(updates).length > 0) {
                await this.multilingualTextService.updateMultilingualText(
                    ModuleNameMultilingualText.multilingual_settings,
                    keyValue,
                    updates,
                );
            }

            // Delete entries for null/empty values
            for (const lang of deletions) {
                await this.multilingualTextService.deleteMultilingualText(
                    ModuleNameMultilingualText.multilingual_settings,
                    keyValue,
                    lang,
                );
            }
        }

        const newSettings = await this.findAll();

        this.sseService.emit(sseEvents.MultilingualSettingsChanged, newSettings);
        this.logger.log(`[${entity.name}] Updated multilingual settings`);

        return newSettings;
    }
}
