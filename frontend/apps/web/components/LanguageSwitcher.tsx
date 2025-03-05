"use client";
import plFlag from "flag-icons/flags/4x3/pl.svg";
import gbFlag from "flag-icons/flags/4x3/gb.svg";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

export default function LanguageSwitcher() {
    const router = useRouter();

    // Set the locale cookie and refresh the page
    const flagClickHandler = (locale: string) => {
        setCookie("locale", locale, { maxAge: 10 });
        router.refresh();
    };

    return (
        <div className="flex w-full items-end justify-end">
            <a onClick={() => flagClickHandler("pl")} className="cursor-pointer">
                <Image
                    src={plFlag}
                    alt="PL"
                    height={48}
                    className="m-1 rounded-lg border-2 border-gray-2"
                />
            </a>
            <a onClick={() => flagClickHandler("en")} className="cursor-pointer">
                <Image
                    src={gbFlag}
                    alt="GB"
                    height={48}
                    className="m-1 rounded-lg border-2 border-gray-2"
                />
            </a>
        </div>
    );
}
