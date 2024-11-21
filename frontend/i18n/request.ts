import { getGlobalSettingsSSR } from "@/utils/api/SSR/settings";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const locales = ["en", "pl"];
const defaultLocale = locales[0];

export default getRequestConfig(async () => {
    //set locale based on cookie or globalSettings

    let locale: string | null = null;

    //set locale from cookie
    const cookieLocale = (await cookies()).get("locale")?.value;
    if (cookieLocale != undefined && locales.includes(cookieLocale as any)) {
        locale = cookieLocale;
    }

    // set locale from globalSettings
    if (locale == null) {
        const globalSettings = await getGlobalSettingsSSR();
        if (locales.includes(globalSettings.locale as any)) {
            locale = globalSettings.locale;
        }
    }

    //If cannot set locale automatically, set default locale
    if (locale == null) {
        locale = defaultLocale;
    }

    return {
        locale,
        messages: (await import(`./translations/${locale}.json`)).default,
    };
});
