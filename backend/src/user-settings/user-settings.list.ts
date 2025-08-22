import { NumRangeValue } from "src/settings/types/numRangeValue.class";
import { Setting, SettingSupportedTypes } from "../settings/setting.class";

//Remember to keep name of setting and 'key' argument the same
export const userSettingsList: { [key: string]: Setting<SettingSupportedTypes> } = {
    seat: new Setting<NumRangeValue>("seat", new NumRangeValue(1, 1, 999)),
};

export const userSettingsListKeys = Object.keys(userSettingsList) as Array<keyof typeof userSettingsList>;
