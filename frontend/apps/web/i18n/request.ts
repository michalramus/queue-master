import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { getGlobalSettings } from "shared-utils";

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
        const globalSettings = await getGlobalSettings(axiosPureInstance);
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
        messages: (await import(`../../../i18n/${locale}.json`)).default,
    };
});
