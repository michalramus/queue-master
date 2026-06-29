export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import RefreshOnSseEvents from "@/components/RefreshOnSseEvents";
import ClientErrorBoundary from "@/components/ClientErrorBoundary";
import { getGlobalSettings, GlobalSettingsInterface } from "shared-utils";
import { StartupScreen } from "shared-components";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { SseProvider } from "@/utils/providers/SseProvider";
import GlobalStylesProvider from "@/components/GlobalStylesProvider";
import { ToastContainer } from "react-toastify";
import { TopLoadingBarProvider } from "@/utils/providers/TopLoadingBarProvider";
import { getCachedAuthInfo } from "@/utils/server/getCachedAuthInfo";
import { QueryClient, dehydrate } from "@tanstack/react-query";

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
    let globalSettings: GlobalSettingsInterface;

    try {
        globalSettings = await getGlobalSettings(axiosPureInstance);
    } catch (error) {
        return (
            <html>
                <body>
                    <StartupScreen
                        status="error"
                        title="Cannot connect to backend"
                        details="Failed to load global settings. Check backend connection."
                    />
                </body>
            </html>
        );
    }

    const locale = await getLocale();
    const messages = await getMessages();

    // Hydrate server-fetched data into TanStack Query so clients don't refetch
    const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } });
    queryClient.setQueryData(["globalSettings"], globalSettings);
    const authInfo = await getCachedAuthInfo();
    if (authInfo) {
        queryClient.setQueryData(["authInfo"], authInfo);
    }
    const dehydratedState = dehydrate(queryClient);

    return (
        <html lang={locale}>
            <body className={inter.className}>
                {/* Setup global colors - server-side initial render */}
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
                                ${globalSettings.color_yellow_1 ? `--color-yellow-1: ${globalSettings.color_yellow_1} !important;` : ""}
                                ${globalSettings.color_yellow_2 ? `--color-yellow-2: ${globalSettings.color_yellow_2} !important;` : ""}
                                ${globalSettings.color_text_1 ? `--color-text-1: ${globalSettings.color_text_1} !important;` : ""}
                                ${globalSettings.color_text_2 ? `--color-text-2: ${globalSettings.color_text_2} !important;` : ""}
                                }`}</style>
                <ClientErrorBoundary>
                    <NextIntlClientProvider messages={messages}>
                        <ReactQueryProvider dehydratedState={dehydratedState}>
                            <SseProvider>
                                <TopLoadingBarProvider>
                                    <ToastContainer />
                                    <GlobalStylesProvider initialData={globalSettings} />
                                    <RefreshOnSseEvents />
                                    <main>{children}</main>
                                </TopLoadingBarProvider>
                            </SseProvider>
                        </ReactQueryProvider>
                    </NextIntlClientProvider>
                </ClientErrorBoundary>
            </body>
        </html>
    );
}

//TODO: RefreshOnSSEEvents as hook instead of tag
