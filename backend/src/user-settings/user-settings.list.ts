import { BooleanSettingValue } from "src/settings/types/booleanSettingValue.class";
import { Setting, SettingSupportedTypes } from "../settings/setting.class";

//Remember to keep name of setting and 'key' argument the same
export const userSettingsList: { [key: string]: Setting<SettingSupportedTypes> } = {
    notifications_on: new Setting<BooleanSettingValue>("notifications_on", new BooleanSettingValue(true)),
};

export const userSettingsListKeys = Object.keys(userSettingsList) as Array<keyof typeof userSettingsList>;
