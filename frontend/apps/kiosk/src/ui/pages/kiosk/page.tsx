import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import CategoriesForm from "./CategoriesForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Header, SmallHeader } from "shared-components";
import { getCategories, getLogoAvailability } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";
import { useQuery } from "@tanstack/react-query";

export default function KioskPage() {
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

    const mainLogoId = 1;
    const secondaryLogoId = 2;

    //TODO Assign img sizes
    return (
        <main className="flex min-h-screen flex-col items-center px-10">
            <div className="flex w-full items-center justify-between">
                <div className="relative h-48">
                    {logoAvailabilities!.includes(secondaryLogoId) && (
                        <img
                            src={`http://localhost:3001/file/logo/${secondaryLogoId}`}
                            alt="External Logo"
                            className="max-h-48"
                        />
                    )}
                </div>
                <LanguageSwitcher />
            </div>
            {logoAvailabilities!.includes(mainLogoId) && (
                <div className="relative mb-2 h-64 w-full">
                    <img
                        src={`http://localhost:3001/file/logo/${mainLogoId}`}
                        alt="External Logo"
                        className="mx-auto block max-h-64"
                    />
                </div>
            )}

            {!logoAvailabilities!.includes(mainLogoId) && <Header />}

            <CategoriesForm categories={categories!} />

            <div className="fixed right-0 bottom-0 m-7">
                <SmallHeader />
            </div>
        </main>
    );
}
