import plFlag from "flag-icons/flags/4x3/pl.svg";
import gbFlag from "flag-icons/flags/4x3/gb.svg";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const flagClickHandler = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div className="flex w-full items-end justify-end">
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
