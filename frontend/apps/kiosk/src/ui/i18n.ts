import i18n from "i18next";

import { initReactI18next } from "react-i18next";
import Backend from "./utils/i18nextBackend";

i18n.use(Backend)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        supportedLngs: ["en", "pl"],
    });

export default i18n;
