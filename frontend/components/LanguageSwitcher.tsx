"use client";

import plFlag from "/node_modules/flag-icons/flags/4x3/pl.svg";
import gbFlag from "/node_modules/flag-icons/flags/4x3/gb.svg";
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
                <Image src={plFlag} alt="PL" height={48} className="m-0.5 border border-text-1" />
            </a>
            <a onClick={() => flagClickHandler("en")} className="cursor-pointer">
                <Image src={gbFlag} alt="GB" height={48} className="m-0.5 border border-text-1" />
            </a>
        </div>
    );
}
