import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import CategoriesForm from "./CategoriesForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Header, SmallHeader } from "shared-components";
import { getCategories, getLogoAvailability, LogoID } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { useQuery } from "@tanstack/react-query";
import useAppConfig from "@/utils/providers/AppConfigProvider";

export default function KioskPage() {
    const appConfig = useAppConfig();

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

    if (logoAvailabilitiesLoading || categoriesLoading) {
        return <div>Loading...</div>;
    }

    if (categoriesError) {
        return (
            <div>
                Error when fetching categories. Check again jwt token. Check console for more
                details.
            </div>
        );
    }

    //TODO Assign img sizes
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

            <CategoriesForm categories={categories!} />

            <div className="fixed right-0 bottom-0 m-7">
                <SmallHeader />
            </div>
        </main>
    );
}
