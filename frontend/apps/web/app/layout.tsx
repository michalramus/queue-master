import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import { getGlobalSettingsSSR } from "@/utils/api/SSR/settings";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import RefreshOnGlobalSettingsChanged from "@/components/RefreshOnGlobalSettingsChanged";
import { GlobalSettingsProvider } from "@/utils/providers/GlobalSettingsProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Queue Master",
    description: "Queue Master by Michał Ramus",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const globalSettings = await getGlobalSettingsSSR();

    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={inter.className}>
                {/* Setup global colors */}
                <style>{`:root { 
                                ${globalSettings.color_background ? `--color-background: ${globalSettings.color_background} !important;` : ""}
                                ${globalSettings.color_primary_1 ? `--color-primary-1: ${globalSettings.color_primary_1} !important;` : ""}
                                ${globalSettings.color_primary_2 ? `--color-primary-2: ${globalSettings.color_primary_2} !important;` : ""}
                                ${globalSettings.color_secondary_1 ? `--color-secondary-1: ${globalSettings.color_secondary_1} !important;` : ""}
                                ${globalSettings.color_secondary_2 ? `--color-secondary-2: ${globalSettings.color_secondary_2} !important;` : ""}
                                ${globalSettings.color_accent_1 ? `--color-accent-1: ${globalSettings.color_accent_1} !important;` : ""}
                                ${globalSettings.color_green_1 ? `--color-green-1: ${globalSettings.color_green_1} !important;` : ""}
                                ${globalSettings.color_green_2 ? `--color-green-2: ${globalSettings.color_green_2} !important;` : ""}
                                ${globalSettings.color_blue_1 ? `--color-blue-1: ${globalSettings.color_blue_1} !important;` : ""}
                                ${globalSettings.color_blue_2 ? `--color-blue-2: ${globalSettings.color_blue_2} !important;` : ""}
                                ${globalSettings.color_red_1 ? `--color-red-1: ${globalSettings.color_red_1} !important;` : ""}
                                ${globalSettings.color_red_2 ? `--color-red-2: ${globalSettings.color_red_2} !important;` : ""}
                                ${globalSettings.color_gray_1 ? `--color-gray-1: ${globalSettings.color_gray_1} !important;` : ""}
                                ${globalSettings.color_gray_2 ? `--color-gray-2: ${globalSettings.color_gray_2} !important;` : ""}
                                ${globalSettings.color_text_1 ? `--color-text-1: ${globalSettings.color_text_1} !important;` : ""}
                                ${globalSettings.color_text_2 ? `--color-text-2: ${globalSettings.color_text_2} !important;` : ""}
                                }`}</style>
                <RefreshOnGlobalSettingsChanged />
                <NextIntlClientProvider messages={messages}>
                    <GlobalSettingsProvider globalSettings={globalSettings}>
                        <ReactQueryProvider>
                            <main>{children}</main>
                        </ReactQueryProvider>
                    </GlobalSettingsProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
