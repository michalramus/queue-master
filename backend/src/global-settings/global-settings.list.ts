import { hexColorSettingValue } from "src/settings/types/hexColorSettingValue.class";
import { Setting, SettingSupportedTypes } from "../settings/setting.class";

export const globalSettingsList: { [key: string]: Setting<SettingSupportedTypes> } = {
    //colors
    color_primary_1: new Setting<hexColorSettingValue>("color_primary_1", new hexColorSettingValue("#27ce5e")),
    color_primary_2: new Setting<hexColorSettingValue>("color_primary_2", new hexColorSettingValue("#11b046")),
    color_secondary_1: new Setting<hexColorSettingValue>("color_secondary_1", new hexColorSettingValue("#dcffdc")),
    color_secondary_2: new Setting<hexColorSettingValue>("color_secondary_2", new hexColorSettingValue("#91e6ad")),
    color_accent_1: new Setting<hexColorSettingValue>("color_accent_1", new hexColorSettingValue("#3bff72")),
    color_green_1: new Setting<hexColorSettingValue>("color_green_1", new hexColorSettingValue("#63cb6b")),
    color_green_2: new Setting<hexColorSettingValue>("color_green_2", new hexColorSettingValue("#21ba2d")),
    color_blue_1: new Setting<hexColorSettingValue>("color_blue_1", new hexColorSettingValue("#689ff0")),
    color_blue_2: new Setting<hexColorSettingValue>("color_blue_2", new hexColorSettingValue("#2071e9")),
    color_red_1: new Setting<hexColorSettingValue>("color_red_1", new hexColorSettingValue("#e6705d")),
    color_red_2: new Setting<hexColorSettingValue>("color_red_2", new hexColorSettingValue("#e04c34")),
    color_gray_1: new Setting<hexColorSettingValue>("color_gray_1", new hexColorSettingValue("#B1B2B5")),
    color_gray_2: new Setting<hexColorSettingValue>("color_gray_2", new hexColorSettingValue("#949494")),
    color_text_1: new Setting<hexColorSettingValue>("color_text_1", new hexColorSettingValue("#050315")),
    color_text_2: new Setting<hexColorSettingValue>("color_text_2", new hexColorSettingValue("#4b5563")),
};

export const globalSettingsListKeys = Object.keys(globalSettingsList) as Array<keyof typeof globalSettingsList>;
