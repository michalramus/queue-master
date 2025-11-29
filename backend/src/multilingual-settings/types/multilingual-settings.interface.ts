import { LangCode } from "@prisma/client";
import { MultilingualSettingKeyNames } from "./multilingual-settings.list";

export type MultilingualSettingsInterface = {
    [K in MultilingualSettingKeyNames]?: { [lang in LangCode]?: string | null };
};
