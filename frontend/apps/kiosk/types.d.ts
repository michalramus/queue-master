interface AppConfigInterface {
    JWTToken: string;
    backendUrl: string;
    mode: "kiosk" | "tv";
    zoomFactor?: number; //Zoom factor for the window

    printingScript?: string; //Path to printing script
    printingDialogueShowTime?: number; //Block screen and show printing info for this amount of time in ms

    audioSynthesizerScript?: string;

    configError?: boolean; //If true, config is invalid

    openingHoursEnableBanner: boolean; //If true, banner with opening hours will be shown when the kiosk is closed
    openingHoursEnableScripts: boolean;
    openingHoursOpenScript?: string;
    openingHoursCloseScript?: string;
}

interface ElectronAPIInterface {
    executePrintTicket: (client: ClientInterface, printingTicketTemplate: string) => Promise<void>;
    executeOpenKioskScript: () => Promise<void>;
    executeCloseKioskScript: () => Promise<void>;

    invokeAudioSynthesizer: (client: ClientInterface) => Promise<void>;

    getTranslation: (lang: string) => Promise<{ [key: string]: any }>;
    getAppConfig: () => Promise<AppConfigInterface>;
    getLocalIpAddress: () => Promise<string>;
}

interface Window {
    electronAPI: ElectronAPIInterface;
}
