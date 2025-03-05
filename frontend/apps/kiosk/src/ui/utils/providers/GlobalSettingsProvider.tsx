import { createContext, useContext, ReactNode, JSX } from "react";
import { GlobalSettingsInterface } from "shared-utils";

// Initializing context with the type (undefined at first)
const GlobalSettingsContext = createContext<GlobalSettingsInterface | undefined>(undefined);

export function GlobalSettingsProvider({
    children,
    globalSettings,
}: {
    children: ReactNode;
    globalSettings: GlobalSettingsInterface;
}): JSX.Element {
    return (
        <GlobalSettingsContext.Provider value={globalSettings}>
            {children}
        </GlobalSettingsContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export default function useGlobalSettings() {
    const context = useContext(GlobalSettingsContext);
    if (!context) {
        throw new Error("useGlobalSettings must be used within a GlobalSettingsProvider");
    }
    return context;
}
