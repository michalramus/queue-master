import CategoriesForm from "./CategoriesForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button, Header, SmallHeader, StartupScreen } from "shared-components";
import {
    LogoID,
    MultilingualSettingsInterface,
    OpeningHoursDto,
    useCategories,
} from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";

import OpeningHoursWidget from "@/components/OpeningHoursWidget";
import { useAppConfig } from "@/utils/hooks/useAppConfig";
import { useLogoManagement } from "@/utils/hooks/useLogoManagement";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const OPENING_HOURS_SHOW_DURATION = 60_000;

export default function KioskPage({
    openingHours,
    kioskOpen,
    multilingualSettings,
}: {
    openingHours: OpeningHoursDto[];
    kioskOpen: boolean;
    multilingualSettings?: MultilingualSettingsInterface;
}) {
    const { data: appConfig } = useAppConfig();
    const { t } = useTranslation();
    const [showOpeningHours, setShowOpeningHours] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleShowOpeningHours = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setShowOpeningHours(true);
        timerRef.current = setTimeout(
            () => setShowOpeningHours(false),
            OPENING_HOURS_SHOW_DURATION,
        );
    };

    const handleCloseOpeningHours = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setShowOpeningHours(false);
    };

    const {
        mainLogoUrl,
        secondaryLogoUrl,
        isLoading: logoAvailabilityLoading,
    } = useLogoManagement(LogoID.logo_kiosk_main, LogoID.logo_kiosk_secondary);

    const {
        data: categories,
        isLoading: categoriesLoading,
        isError: categoriesError,
    } = useCategories(axiosAuthInstance);

    if (logoAvailabilityLoading || categoriesLoading) {
        return (
            <StartupScreen
                status="loading"
                title="Loading…"
                details="Fetching categories, please wait."
            />
        );
    }

    if (categoriesError) {
        return (
            <StartupScreen
                status="error"
                title="Failed to load categories"
                details="Check the JWT token in config. See console for more details."
            />
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center px-10">
            <div className="flex w-full items-center justify-between">
                <div className="relative flex h-48 w-md items-center justify-start pt-4">
                    {secondaryLogoUrl !== null && (
                        <img
                            src={secondaryLogoUrl}
                            alt="External Logo"
                            className="max-h-48 w-auto object-contain"
                        />
                    )}
                </div>
                <div className="flex w-36 flex-col gap-2">
                    <LanguageSwitcher />
                    {kioskOpen && (
                        <Button
                            onClick={handleShowOpeningHours}
                            className="border-primary-1 relative! m-0! flex! w-full! items-center! justify-center! rounded-3xl! border-2! text-sm!"
                            color="secondary"
                        >
                            {t("show_opening_hours")}
                        </Button>
                    )}
                </div>
            </div>
            {mainLogoUrl !== null && (
                <div className="relative mb-2 flex h-72 w-2xl items-center justify-center">
                    <img src={mainLogoUrl} alt="External Logo" className="max-h-72" />
                </div>
            )}

            {mainLogoUrl === null && <Header />}

            {showOpeningHours && kioskOpen ? (
                <div className="mx-auto flex w-full max-w-md flex-col items-center">
                    <OpeningHoursWidget
                        openingHours={openingHours || []}
                        multilingualSettings={multilingualSettings}
                        className="mt-10"
                    />
                    <Button
                        onClick={handleCloseOpeningHours}
                        className="border-primary-1 relative! m-3! flex! w-full! items-center! justify-center! rounded-3xl! border-2! p-6! text-3xl!"
                        color="secondary"
                    >
                        {t("close")}
                    </Button>
                </div>
            ) : kioskOpen || !appConfig?.openingHoursEnableBanner ? (
                <CategoriesForm categories={categories!} />
            ) : (
                <OpeningHoursWidget
                    openingHours={openingHours || []}
                    multilingualSettings={multilingualSettings}
                    className="mt-10"
                />
            )}

            <div className="fixed right-0 bottom-0 m-7">
                <SmallHeader />
            </div>
        </main>
    );
}
