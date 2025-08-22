import { Injectable, Logger } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { ModuleNameMultilingualText } from "./types/multilingualTextCategories.enum";

@Injectable()
export class MultilingualTextService {
    constructor(private readonly databaseService: DatabaseService) {}

    private logger = new Logger(MultilingualTextService.name);

    /**
     *
     * @param moduleName
     * @param key
     * @returns JSON in format { lang: translatedText }
     */
    async getMultilingualText(
        moduleName: ModuleNameMultilingualText,
        key: number,
    ): Promise<{ [lang: string]: string }> {
        const translations = await this.databaseService.multilingual_Text.findMany({
            where: {
                module_name: moduleName,
                key: key,
            },
        });

        this.logger.debug(`Fetched translations for module ${moduleName} key ${key}`);
        return translations.reduce((acc, translation) => ({ ...acc, [translation.lang]: translation.value }), {});
    }

    /**
     * Update multilingual text entries
     * @param moduleName
     * @param key
     * @param translations Object with language codes as keys and translations as values. All translations must be provided.
     */
    async updateMultilingualText(
        moduleName: ModuleNameMultilingualText,
        key: number,
        translations: { [lang: string]: string },
    ): Promise<void> {
        // Delete existing translations
        await this.deleteMultilingualText(moduleName, key);

        // Create new translations
        const data = Object.entries(translations).map(([lang, value]) => ({
            module_name: moduleName,
            key: key,
            lang: lang as any, // Cast to enum type
            value: value,
        }));

        await this.databaseService.multilingual_Text.createMany({
            data: data,
        });

        this.logger.debug(`Updated multilingual text for module ${moduleName} key ${key}`);
    }

    /**
     * Delete multilingual text entries
     * @param moduleName
     * @param key
     */
    async deleteMultilingualText(moduleName: ModuleNameMultilingualText, key: number): Promise<void> {
        await this.databaseService.multilingual_Text.deleteMany({
            where: {
                module_name: moduleName,
                key: key,
            },
        });

        this.logger.debug(`Deleted multilingual text for module ${moduleName} key ${key}`);
    }
}
