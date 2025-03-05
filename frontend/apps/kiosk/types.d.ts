interface AppConfigInterface {
    JWTToken: string;
    backendUrl: string;
    mode: "kiosk" | "tv";

    configError?: boolean; //If true, config is invalid
}

interface ElectronAPIInterface {
    getTranslation: (lang: string) => Promise<{ [key: string]: any }>;
    getAppConfig: () => Promise<AppConfigInterface>;
}

interface Window {
    electronAPI: ElectronAPIInterface;
}
