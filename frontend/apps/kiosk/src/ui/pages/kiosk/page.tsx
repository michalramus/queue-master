import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import CategoriesForm from "./CategoriesForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Header, SmallHeader } from "shared-components";
import { LogoID, OpeningHoursDto, useCategories, useLogoAvailabilities as useLogoAvailability } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";

import OpeningHoursWidget from "@/components/OpeningHoursWidget";
import { useAppConfig } from "@/utils/hooks/useAppConfig";

export default function KioskPage({
    openingHours,
    kioskOpen,
}: {
    openingHours: OpeningHoursDto[];
    kioskOpen: boolean;
}) {
    const { data: appConfig } = useAppConfig();

    const { data: logoAvailability, isLoading: logoAvailabilityLoading } = useLogoAvailability(axiosPureInstance);

    const {
        data: categories,
        isLoading: categoriesLoading,
        isError: categoriesError,
    } = useCategories(axiosAuthInstance);

    if (logoAvailabilityLoading || categoriesLoading) {
        return <div>Loading...</div>;
    }

    if (categoriesError) {
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
                <div className="relative flex h-48 w-md items-center justify-start pt-4">
                    {logoAvailability?.includes(LogoID.logo_kiosk_secondary) && (
                        <img
                            src={`${appConfig?.backendUrl}/file/logo/${LogoID.logo_kiosk_secondary}`}
                            alt="External Logo"
                            className="max-h-48 w-auto object-contain"
                        />
                    )}
                </div>
                <LanguageSwitcher />
            </div>
            {logoAvailability?.includes(LogoID.logo_kiosk_main) && (
                <div className="relative mb-2 flex h-72 w-2xl items-center justify-center">
                    <img
                        src={`${appConfig?.backendUrl}/file/logo/${LogoID.logo_kiosk_main}`}
                        alt="External Logo"
                        className="max-h-72"
                    />
                </div>
            )}

            {!logoAvailability!.includes(LogoID.logo_kiosk_main) && <Header />}

            {kioskOpen || !appConfig?.openingHoursEnableBanner ? (
                <CategoriesForm categories={categories!} />
            ) : (
                <OpeningHoursWidget openingHours={openingHours || []} className="mt-10" />
            )}

            <div className="fixed right-0 bottom-0 m-7">
                <SmallHeader />
            </div>
        </main>
    );
}
