import { Injectable, Logger } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { globalSettingsList } from "./global-settings.list";
import { SettingSupportedTypes } from "src/settings/setting.class";
import { Entity } from "src/auth/types/entity.class";

@Injectable()
export class GlobalSettingsService {
    constructor(private readonly databaseService: DatabaseService) {}
    private logger = new Logger(GlobalSettingsService.name);

    async findAll(): Promise<string> {
        //find all settings in database and complete with default values

        const rawSettings = await this.databaseService.global_Setting.findMany();
        const settings: { [key: string]: SettingSupportedTypes } = {};

        Object.keys(globalSettingsList).forEach((key) => {
            if (rawSettings.some((setting) => setting.key === key)) {
                const setting = globalSettingsList[key].convertSettingFromString(
                    rawSettings.find((setting) => setting.key === key).value,
                );
                settings[key] = setting;
            } else {
                settings[key] = globalSettingsList[key].defaultValue;
            }
        });

        return JSON.stringify(settings);
    }

    async update(settings: { [key: string]: string | number }, entity: Entity): Promise<string> {
        this.logger.log(`[${entity.name}] Updating settings: ${JSON.stringify(settings)}`);
        //find setting in globalSettings, convert to string and save to database
        for (const [key, setting] of Object.entries(settings)) {
            if (!globalSettingsList.hasOwnProperty(key)) {
                this.logger.warn(`Setting with key '${key}' and value '${setting}' not found in globalSettings.`);
                continue;
            }

            if (!globalSettingsList[key].isValueCorrect(setting)) {
                this.logger.warn(
                    `Trying to set setting with key '${key}' and value '${setting}' - setting is not correct.`,
                );
                continue;
            }

            await this.databaseService.global_Setting.upsert({
                where: {
                    key: key.toString(),
                },
                update: {
                    value: setting.toString(),
                },
                create: {
                    key: key.toString(),
                    value: setting.toString(),
                },
            });
        }

        return this.findAll();
    }
}
