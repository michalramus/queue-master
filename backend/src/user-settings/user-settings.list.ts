import { Setting, SettingSupportedTypes } from "../settings/setting.class";

export const userSettingsList: { [key: string]: Setting<SettingSupportedTypes> } = {
    seat: new Setting<number>("seat", 1),
};

export const userSettingsListKeys = Object.keys(userSettingsList) as Array<keyof typeof userSettingsList>;
