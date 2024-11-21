import { HexColorSettingValue } from "src/settings/types/hexColorSettingValue.class";
import { Setting, SettingSupportedTypes } from "../settings/setting.class";
import { EnumSettingValue } from "src/settings/types/enumSettingValue.class";

export const globalSettingsList: { [key: string]: Setting<SettingSupportedTypes> } = {
    //colors
    color_background: new Setting<HexColorSettingValue>("color_background", new HexColorSettingValue("#fbfefb")),
    color_primary_1: new Setting<HexColorSettingValue>("color_primary_1", new HexColorSettingValue("#27ce5e")),
    color_primary_2: new Setting<HexColorSettingValue>("color_primary_2", new HexColorSettingValue("#11b046")),
    color_secondary_1: new Setting<HexColorSettingValue>("color_secondary_1", new HexColorSettingValue("#dcffdc")),
    color_secondary_2: new Setting<HexColorSettingValue>("color_secondary_2", new HexColorSettingValue("#91e6ad")),
    color_accent_1: new Setting<HexColorSettingValue>("color_accent_1", new HexColorSettingValue("#3bff72")),
    color_green_1: new Setting<HexColorSettingValue>("color_green_1", new HexColorSettingValue("#63cb6b")),
    color_green_2: new Setting<HexColorSettingValue>("color_green_2", new HexColorSettingValue("#21ba2d")),
    color_blue_1: new Setting<HexColorSettingValue>("color_blue_1", new HexColorSettingValue("#689ff0")),
    color_blue_2: new Setting<HexColorSettingValue>("color_blue_2", new HexColorSettingValue("#2071e9")),
    color_red_1: new Setting<HexColorSettingValue>("color_red_1", new HexColorSettingValue("#e6705d")),
    color_red_2: new Setting<HexColorSettingValue>("color_red_2", new HexColorSettingValue("#e04c34")),
    color_gray_1: new Setting<HexColorSettingValue>("color_gray_1", new HexColorSettingValue("#B1B2B5")),
    color_gray_2: new Setting<HexColorSettingValue>("color_gray_2", new HexColorSettingValue("#949494")),
    color_text_1: new Setting<HexColorSettingValue>("color_text_1", new HexColorSettingValue("#050315")),
    color_text_2: new Setting<HexColorSettingValue>("color_text_2", new HexColorSettingValue("#4b5563")),

    kiosk_markdown: new Setting<string>("kiosk_markdown", ""), //markdown text shown on kiosk page
    locale: new Setting<EnumSettingValue>("locale", new EnumSettingValue("en", ["en", "pl"])),
};

export const globalSettingsListKeys = Object.keys(globalSettingsList) as Array<keyof typeof globalSettingsList>;
