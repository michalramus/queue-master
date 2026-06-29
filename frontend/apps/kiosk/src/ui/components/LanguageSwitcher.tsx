import plFlag from "flag-icons/flags/4x3/pl.svg";
import gbFlag from "flag-icons/flags/4x3/gb.svg";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { useGlobalSettings } from "shared-utils";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";

const INACTIVITY_TIMEOUT = 60000; // in ms

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const { data: globalSettings } = useGlobalSettings(axiosPureInstance);
    const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const defaultLanguage = globalSettings?.locale || "en";

    const resetToDefaultLanguage = () => {
        i18n.changeLanguage(defaultLanguage);
    };

    const resetInactivityTimer = () => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }

        // Only start timer if current language is not the default
        if (i18n.language !== defaultLanguage) {
            inactivityTimerRef.current = setTimeout(() => {
                resetToDefaultLanguage();
            }, INACTIVITY_TIMEOUT);
        }
    };

    useEffect(() => {
        // Start inactivity timer
        resetInactivityTimer();

        // Listen for language change events to reset the timer
        const handleLanguageChange = () => {
            resetInactivityTimer();
        };

        i18n.on("languageChanged", handleLanguageChange);

        // Cleanup
        return () => {
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
            i18n.off("languageChanged", handleLanguageChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n, defaultLanguage]);

    const flagClickHandler = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div className="flex items-end justify-end">
            <a onClick={() => flagClickHandler("pl")} className="cursor-pointer">
                <img
                    src={plFlag}
                    alt="PL"
                    width={64}
                    height={48}
                    className="border-gray-2 m-1 rounded-lg border-2"
                />
            </a>
            <a onClick={() => flagClickHandler("en")} className="cursor-pointer">
                <img
                    src={gbFlag}
                    alt="GB"
                    width={64}
                    height={48}
                    className="border-gray-2 m-1 rounded-lg border-2"
                />
            </a>
        </div>
    );
}
