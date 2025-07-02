import { HttpException, Injectable, Logger } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { Entity } from "../auth/types/entity.class";
import { userSettingsList } from "./user-settings.list";
import { SettingSupportedTypes } from "src/settings/setting.class";
import { UsersService } from "../users/users.service";

@Injectable()
export class UserSettingsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly usersService: UsersService,
    ) {}
    logger = new Logger(UserSettingsService.name);

    findSettings(entity: Entity): Promise<string> {
        return this.findUserSettings(entity.id);
    }

    /**
     *
     * @param id user id
     * @returns
     */
    async findUserSettings(id: number): Promise<string> {
        //find all settings in database and complete with default values
        if (this.usersService.findOneById(id) === null) {
            throw new HttpException(`User with id ${id} not found`, 404);
        }

        const rawSettings = await this.databaseService.user_Setting.findMany({
            where: {
                user_id: id,
            },
        });
        const settings: { [key: string]: SettingSupportedTypes } = {};

        Object.keys(userSettingsList).forEach((key) => {
            if (rawSettings.some((setting) => setting.key === key)) {
                const setting = userSettingsList[key].convertSettingFromString(
                    rawSettings.find((setting) => setting.key === key).value,
                );
                settings[key] = setting;
            } else {
                settings[key] = userSettingsList[key].defaultValue;
            }
        });

        return JSON.stringify(settings);
    }

    updateSettings(settings: { [key: string]: string | number }, entity: Entity): Promise<string> {
        return this.updateUserSettings(entity.id, settings, entity);
    }

    /**
     *
     * @param id user id
     * @param settings
     * @param entity
     * @returns
     */
    async updateUserSettings(
        id: number,
        settings: { [key: string]: string | number },
        entity: Entity,
    ): Promise<string> {
        this.logger.log(
            `[${entity.name} id:${entity.id}] Updating settings: ${JSON.stringify(settings)} for user ${id}`,
        );

        if (this.usersService.findOneById(id) === null) {
            this.logger.warn(`User with id ${id} not found. Cannot update settings.`);
            throw new HttpException(`User with id ${id} not found`, 404);
        }

        //find setting in globalSettings, convert to string and save to database
        for (const [key, setting] of Object.entries(settings)) {
            if (!userSettingsList.hasOwnProperty(key)) {
                this.logger.warn(`Setting with key '${key}' and value '${setting}' not found in userSettings.`);
                continue;
            }

            if (!userSettingsList[key].isValueCorrect(setting)) {
                this.logger.warn(
                    `Trying to set setting with key '${key}' and value '${setting}' - setting is not correct.`,
                );
                continue;
            }

            await this.databaseService.user_Setting.deleteMany({
                where: {
                    user_id: id,
                    key: key.toString(),
                },
            });

            await this.databaseService.user_Setting.create({
                data: {
                    user_id: id,
                    key: key.toString(),
                    value: setting.toString(),
                },
            });
        }

        return this.findUserSettings(id);
    }
}
