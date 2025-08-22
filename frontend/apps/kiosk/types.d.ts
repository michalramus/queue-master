interface AppConfigInterface {
    JWTToken: string;
    backendUrl: string;
    mode: "kiosk" | "tv";

    printingScript?: string; //Path to printing script
    printingDialogueShowTime?: number; //Block screen and show printing info for this amount of time in ms

    audioSynthesizerScript?: string;

    configError?: boolean; //If true, config is invalid

    opening_hours_enable_banner: boolean;
    opening_hours_enable_scripts: boolean;
    opening_hours_open_script?: string;
    opening_hours_close_script?: string;
}

interface ElectronAPIInterface {
    executePrintTicket: (client: ClientInterface, printingTicketTemplate: string) => Promise<void>;
    executeOpenKioskScript: () => Promise<void>;
    executeCloseKioskScript: () => Promise<void>;

    invokeAudioSynthesizer: (client: ClientInterface) => Promise<void>;

    getTranslation: (lang: string) => Promise<{ [key: string]: any }>;
    getAppConfig: () => Promise<AppConfigInterface>;
}

interface Window {
    electronAPI: ElectronAPIInterface;
}
