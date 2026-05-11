import { LangCode } from "shared-utils";

export const langLabelKey: Record<LangCode, string> = {
    [LangCode.en]: "english_name",
    [LangCode.pl]: "polish_name",
};

export function initLangRecord<T>(getValue: (lang: LangCode) => T): Record<LangCode, T> {
    return Object.fromEntries(
        Object.values(LangCode).map((lang) => [lang, getValue(lang)]),
    ) as Record<LangCode, T>;
}
