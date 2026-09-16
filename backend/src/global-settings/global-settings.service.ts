import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { globalSettingsList } from "./global-settings.list";
import { SettingSupportedTypes } from "src/settings/setting.class";
import { Entity } from "src/auth/types/entity.class";
import { SseService } from "../sse/sse.service";
import { sseEvents } from "src/sse/sseEvents.enum";

@Injectable()
export class GlobalSettingsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly sseService: SseService,
    ) {}
    private logger = new Logger(GlobalSettingsService.name);

    async findAll(): Promise<string> {
        //find all settings in database and complete with default values

        const rawSettings = await this.databaseService.global_Setting.findMany();
        const settings: { [key: string]: SettingSupportedTypes } = {};

        Object.keys(globalSettingsList).forEach((key) => {
            const rawSetting = rawSettings.find((setting) => setting.key === key);
            if (rawSetting) {
                settings[key] = globalSettingsList[key].convertSettingFromString(rawSetting.value);
            } else {
                settings[key] = globalSettingsList[key].defaultValue;
            }
        });

        return JSON.stringify(settings);
    }

    async update(settings: { [key: string]: string | number }, entity: Entity): Promise<string> {
        this.logger.log(`[${entity.name}] Updating settings: ${JSON.stringify(settings)}`);

        // Validate everything up front - the whole request is rejected instead of being partially persisted
        const unknownKeys: string[] = [];
        const invalidValues: string[] = [];

        for (const [key, setting] of Object.entries(settings)) {
            if (!Object.prototype.hasOwnProperty.call(globalSettingsList, key)) {
                this.logger.warn(`Setting with key '${key}' and value '${setting}' not found in globalSettings.`);
                unknownKeys.push(key);
                continue;
            }

            if (!globalSettingsList[key].isValueCorrect(setting)) {
                this.logger.warn(
                    `Trying to set setting with key '${key}' and value '${setting}' - setting is not correct.`,
                );
                invalidValues.push(`${key}: '${setting}'`);
            }
        }

        if (unknownKeys.length > 0 || invalidValues.length > 0) {
            const messages: string[] = [];
            if (unknownKeys.length > 0) {
                messages.push(`Unknown setting keys: ${unknownKeys.join(", ")}`);
            }
            if (invalidValues.length > 0) {
                messages.push(`Invalid setting values: ${invalidValues.join(", ")}`);
            }
            throw new BadRequestException(messages.join(". "));
        }

        //find setting in globalSettings, convert to string and save to database
        for (const [key, setting] of Object.entries(settings)) {
            await this.databaseService.global_Setting.deleteMany({
                where: {
                    key: key.toString(),
                },
            });

            await this.databaseService.global_Setting.create({
                data: {
                    key: key.toString(),
                    value: setting.toString(),
                },
            });
        }

        const newSettings = await this.findAll();

        //emit SSE event on globalSettings change
        this.sseService.emit(sseEvents.GlobalSettingsChanged, newSettings);

        return newSettings;
    }

    /**
     * Reset global settings to defaults by deleting specified records
     * @param settings array of setting keys to reset. If empty, reset all settings.
     * @param entity entity performing the action
     * @returns global settings after reset
     */
    async reset(settings: string[], entity: Entity): Promise<string> {
        if (!settings || settings.length === 0) {
            this.logger.log(`[${entity.name}] Resetting all global settings to defaults`);
            // Delete all global settings from database
            await this.databaseService.global_Setting.deleteMany();
        } else {
            this.logger.log(`[${entity.name}] Resetting global settings: ${settings.join(", ")} to defaults`);
            // Delete only specified settings
            await this.databaseService.global_Setting.deleteMany({
                where: {
                    key: {
                        in: settings,
                    },
                },
            });
        }

        const settingsAfterReset = await this.findAll();

        // Emit SSE event on globalSettings change
        this.sseService.emit(sseEvents.GlobalSettingsChanged, settingsAfterReset);

        return settingsAfterReset;
    }
}
