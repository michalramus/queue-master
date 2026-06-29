import { HttpException, Injectable, Logger, Inject, forwardRef, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { Entity } from "../auth/types/entity.class";
import { userSettingsList } from "./user-settings.list";
import { SettingSupportedTypes } from "src/settings/setting.class";
import { UsersService } from "../users/users.service";

@Injectable()
export class UserSettingsService {
    constructor(
        private readonly databaseService: DatabaseService,
        @Inject(forwardRef(() => UsersService))
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
        //check if user exists
        if ((await this.usersService.findOneById(id)) === null) {
            this.logger.warn(`User with id ${id} not found. Cannot update settings.`);
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

    /**
     * Get settings for all users
     * @returns Object mapping user IDs to their settings
     */
    async findAllUsersSettings(): Promise<{ [userId: number]: any }> {
        const users = await this.usersService.findAll();
        const userIds = users.map((user) => user.id);
        const allUsersSettings: { [userId: number]: any } = {};

        // Fetch all settings for all users in one database query
        const rawSettings = await this.databaseService.user_Setting.findMany({
            where: {
                user_id: {
                    in: userIds,
                },
            },
        });

        // Initialize settings for each user with defaults, then override with actual values
        for (const user of users) {
            const settings: { [key: string]: SettingSupportedTypes } = {};

            // Set defaults first
            Object.keys(userSettingsList).forEach((key) => {
                settings[key] = userSettingsList[key].defaultValue;
            });

            // Override with user's actual settings from database
            const userSettings = rawSettings.filter((setting) => setting.user_id === user.id);
            userSettings.forEach((setting) => {
                if (userSettingsList[setting.key]) {
                    settings[setting.key] = userSettingsList[setting.key].convertSettingFromString(setting.value);
                }
            });

            allUsersSettings[user.id] = settings;
        }

        return allUsersSettings;
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
        if ((await this.usersService.findOneById(id)) === null) {
            this.logger.warn(`User with id ${id} not found. Cannot update settings.`);
            throw new HttpException(`User with id ${id} not found`, 404);
        }

        this.logger.debug(
            `[${entity.name} id:${entity.id}] Updating settings: ${JSON.stringify(settings)} for user ${id}`,
        );

        //find setting in globalSettings, convert to string and save to database
        for (const [key, setting] of Object.entries(settings)) {
            if (!Object.prototype.hasOwnProperty.call(userSettingsList, key)) {
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

    /**
     * Reset user settings to defaults by deleting specified records
     * @param id user id
     * @param settings array of setting keys to reset. If empty, reset all settings.
     * @param entity entity performing the action
     * @returns user settings after reset
     */
    async resetUserSettings(id: number, settings: string[], entity: Entity): Promise<string> {
        if ((await this.usersService.findOneById(id)) === null) {
            this.logger.warn(`User with id ${id} not found. Cannot reset settings.`);
            throw new NotFoundException(`User with id ${id} not found`);
        }

        if (settings.length === 0) {
            // Delete all user settings from database
            await this.databaseService.user_Setting.deleteMany({
                where: {
                    user_id: id,
                },
            });
            this.logger.log(`[${entity.name} id:${entity.id}] Reset all settings for user ${id}`);
        } else {
            // Delete only specified settings
            await this.databaseService.user_Setting.deleteMany({
                where: {
                    user_id: id,
                    key: {
                        in: settings,
                    },
                },
            });
            this.logger.log(`[${entity.name} id:${entity.id}] Reset settings for user ${id}: ${settings.join(", ")}`);
        }

        // Return settings after reset
        return this.findUserSettings(id);
    }
}
