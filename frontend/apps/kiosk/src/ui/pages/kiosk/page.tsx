import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import CategoriesForm from "./CategoriesForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Header, SmallHeader } from "shared-components";
import { getCategories, getLogoAvailability, LogoID } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { useQuery } from "@tanstack/react-query";
import useAppConfig from "@/utils/providers/AppConfigProvider";

import { getOpeningHours, OpeningHoursDto } from "shared-utils";
import OpeningHoursWidget from "@/components/OpeningHoursWidget";
import { useEffect, useState } from "react";
import { isKioskOpen } from "@/utils/isKioskOpen";
import useGlobalSettings from "@/utils/providers/GlobalSettingsProvider";

export default function KioskPage() {
    const appConfig = useAppConfig();
    const globalSettings = useGlobalSettings();

    const { data: logoAvailabilities, isLoading: logoAvailabilitiesLoading } = useQuery({
        queryKey: ["KioskPage_logoAvailabilities"],
        queryFn: () => getLogoAvailability(axiosPureInstance),
    });

    const {
        data: categories,
        isLoading: categoriesLoading,
        isError: categoriesError,
    } = useQuery({
        queryKey: ["KioskPage_categories"],
        queryFn: () => getCategories(axiosAuthInstance),
        select: (data) => data?.sort((a, b) => a.short_name.localeCompare(b.short_name)),
    });

    const {
        data: openingHours,
        isLoading: openingHoursLoading,
        isError: openingHoursError,
    } = useQuery<OpeningHoursDto[]>({
        queryKey: ["KioskPage_openingHours"],
        queryFn: () => getOpeningHours(axiosAuthInstance),
    });

    // Make kioskOpen reactive to time
    const [kioskOpen, setKioskOpen] = useState(() =>
        isKioskOpen(openingHours || [], globalSettings),
    );
    useEffect(() => {
        setKioskOpen(isKioskOpen(openingHours || [], globalSettings));
        // Calculate ms until next full minute
        const now = new Date();
        const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        let interval: ReturnType<typeof setInterval>;
        const timeout = setTimeout(() => {
            setKioskOpen(isKioskOpen(openingHours || [], globalSettings));
            interval = setInterval(() => {
                setKioskOpen(isKioskOpen(openingHours || [], globalSettings));
            }, 60000);
        }, msToNextMinute);
        return () => {
            clearTimeout(timeout);
            if (interval) clearInterval(interval);
        };
    }, [openingHours, globalSettings]);

    if (logoAvailabilitiesLoading || categoriesLoading || openingHoursLoading) {
        return <div>Loading...</div>;
    }

    if (categoriesError || openingHoursError) {
        return (
            <div>
                Error when fetching categories or opening hours. Check again jwt token. Check
                console for more details.
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center px-10">
            <div className="flex w-full items-center justify-between">
                <div className="relative flex h-48 w-4/12 items-center justify-start pt-4">
                    {logoAvailabilities?.includes(LogoID.logo_kiosk_secondary) && (
                        <img
                            src={`${appConfig.backendUrl}/file/logo/${LogoID.logo_kiosk_secondary}`}
                            alt="External Logo"
                            className="max-h-48 w-auto object-contain"
                        />
                    )}
                </div>
                <LanguageSwitcher />
            </div>
            {logoAvailabilities?.includes(LogoID.logo_kiosk_main) && (
                <div className="relative mb-2 flex h-64 w-6/12 items-center justify-center">
                    <img
                        src={`${appConfig.backendUrl}/file/logo/${LogoID.logo_kiosk_main}`}
                        alt="External Logo"
                        className="max-h-64"
                    />
                </div>
            )}

            {!logoAvailabilities!.includes(LogoID.logo_kiosk_main) && <Header />}

            {kioskOpen ? (
                <CategoriesForm categories={categories!} />
            ) : (
                <OpeningHoursWidget openingHours={openingHours!} className="mt-10" />
            )}

            <div className="fixed right-0 bottom-0 m-7">
                <SmallHeader />
            </div>
        </main>
    );
}
