import { Injectable, Logger } from "@nestjs/common";
import { LangCode } from "@prisma/client";
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
     * Batch version of getMultilingualText - fetches translations for many keys in a single query.
     * @param moduleName
     * @param keys list of keys to fetch translations for
     * @returns Map of key to JSON in format { lang: translatedText }. Keys without translations map to an empty object.
     */
    async getMultilingualTextForKeys(
        moduleName: ModuleNameMultilingualText,
        keys: number[],
    ): Promise<Map<number, { [lang: string]: string }>> {
        const uniqueKeys = [...new Set(keys)];
        const result = new Map<number, { [lang: string]: string }>();
        uniqueKeys.forEach((key) => result.set(key, {}));

        if (uniqueKeys.length === 0) {
            return result;
        }

        const translations = await this.databaseService.multilingual_Text.findMany({
            where: {
                module_name: moduleName,
                key: { in: uniqueKeys },
            },
        });

        translations.forEach((translation) => {
            const translationsForKey = result.get(translation.key) ?? {};
            translationsForKey[translation.lang] = translation.value;
            result.set(translation.key, translationsForKey);
        });

        this.logger.debug(`Fetched translations for module ${moduleName} and ${uniqueKeys.length} keys`);
        return result;
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
        translations: { [lang in LangCode]?: string },
    ): Promise<void> {
        const data = Object.values(LangCode)
            .map((lang) => ({ lang: lang, value: translations[lang] }))
            .filter((entry): entry is { lang: LangCode; value: string } => entry.value !== undefined)
            .map((entry) => ({
                module_name: moduleName,
                key: key,
                lang: entry.lang,
                value: entry.value,
            }));

        // Replace translations atomically - a partial failure must not drop existing translations
        await this.databaseService.$transaction([
            this.databaseService.multilingual_Text.deleteMany({
                where: {
                    module_name: moduleName,
                    key: key,
                },
            }),
            this.databaseService.multilingual_Text.createMany({
                data: data,
            }),
        ]);

        this.logger.debug(`Updated multilingual text for module ${moduleName} key ${key}`);
    }

    /**
     * Delete multilingual text entries
     * @param moduleName
     * @param key
     * @param lang - Optional language code to delete specific language entry
     */
    async deleteMultilingualText(moduleName: ModuleNameMultilingualText, key: number, lang?: LangCode): Promise<void> {
        await this.databaseService.multilingual_Text.deleteMany({
            where: {
                module_name: moduleName,
                key: key,
                ...(lang && { lang: lang }),
            },
        });

        this.logger.debug(
            `Deleted multilingual text for module ${moduleName} key ${key}${lang ? ` language ${lang}` : ""}`,
        );
    }
}
