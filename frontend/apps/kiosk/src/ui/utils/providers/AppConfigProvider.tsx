import { createContext, useContext, ReactNode, JSX } from "react";
// Initializing context with the type (undefined at first)
const AppConfigContext = createContext<AppConfigInterface | undefined>(undefined);

export function AppConfigProvider({
    children,
    appConfig,
}: {
    children: ReactNode;
    appConfig: AppConfigInterface;
}): JSX.Element {
    return <AppConfigContext.Provider value={appConfig}>{children}</AppConfigContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export default function useAppConfig() {
    const context = useContext(AppConfigContext);
    if (!context) {
        throw new Error("useAppConfig must be used within a AppConfigProvider");
    }
    return context;
}
