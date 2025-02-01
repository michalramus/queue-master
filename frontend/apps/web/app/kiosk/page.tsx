import { getCategoriesSSR } from "@/utils/api/SSR/categories";
import CategoriesForm from "./CategoriesForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Image from "next/image";
import { getLogoAvailabilitySSR } from "@/utils/api/SSR/file";
import { Header, SmallHeader } from "shared-components";

export default async function KioskPage() {
    const categories = await getCategoriesSSR();
    const logoAvailabilities = await getLogoAvailabilitySSR();

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

            <div className="fixed bottom-0 right-0 m-7">
                <SmallHeader />
            </div>
        </main>
    );
}
