import { Setting, SettingSupportedTypes } from "../settings/setting.class";

export const globalSettingsList: { [key: string]: Setting<SettingSupportedTypes> } = {};

export const globalSettingsListKeys = Object.keys(globalSettingsList) as Array<keyof typeof globalSettingsList>;
