import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import CategoriesForm from "./CategoriesForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Image from "next/image";
import { Header, SmallHeader } from "shared-components";
import { getCategories, getLogoAvailability } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";

export default async function KioskPage() {
    const categories = await getCategories(axiosAuthInstance);
    const logoAvailabilities = await getLogoAvailability(axiosPureInstance);

    const mainLogoId = 1;
    const secondaryLogoId = 2;

    return (
        <main className="flex min-h-screen flex-col items-center p-16">
            <div className="flex w-full items-center justify-between">
                <div className="relative h-32 w-3/12">
                    {logoAvailabilities.includes(secondaryLogoId) && (
                        <Image
                            src={`http://localhost:3001/file/logo/${secondaryLogoId}`}
                            alt="External Image"
                            unoptimized
                            fill={true}
                            priority={true}
                        />
                    )}
                </div>
                <LanguageSwitcher />
            </div>
            {logoAvailabilities.includes(mainLogoId) && (
                <div className="relative mb-2 h-48 w-full">
                    <Image
                        src={`http://localhost:3001/file/logo/${mainLogoId}`}
                        alt="External Image"
                        unoptimized
                        fill={true}
                        priority={true}
                    />
                </div>
            )}

            {!logoAvailabilities.includes(mainLogoId) && <Header />}

            <CategoriesForm prefetchCategories={categories} />

            <div className="fixed right-0 bottom-0 m-7">
                <SmallHeader />
            </div>
        </main>
    );
}
