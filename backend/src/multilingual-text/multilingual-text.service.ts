import { Injectable, Logger } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { MultilingualTextCategories } from "./types/multilingualTextCategories.enum";

@Injectable()
export class MultilingualTextService {
    constructor(private readonly databaseService: DatabaseService) {}

    /**
     *
     * @param moduleName
     * @param key
     * @returns JSON in format { lang: translatedText }
     */
    async getMultilingualText(
        moduleName: MultilingualTextCategories,
        key: string,
    ): Promise<{ [lang: string]: string }> {
        const logger = new Logger(MultilingualTextService.name);
        const translations = await this.databaseService.multilingual_Text.findMany({
            where: {
                module_name: moduleName,
                key: key,
            },
        });

        logger.debug(`Fetched translations for ${moduleName} ${key}`);
        return translations.reduce((acc, translation) => ({ ...acc, [translation.lang]: translation.value }), {});
    }
}
