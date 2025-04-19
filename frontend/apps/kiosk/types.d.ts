interface AppConfigInterface {
    JWTToken: string;
    backendUrl: string;
    mode: "kiosk" | "tv";

    printingScript?: string; //Path to printing script
    printingScriptAddPythonPrefix?: boolean; //if true call script like this: python3 <printingScript>         Do not use spaces
    printingScriptDelay?: number; //Show printing screen for this amount of time in ms

    audioSynthesizerScript?: string;
    audioSynthesizerScriptAddPythonPrefix?: boolean; //if true call script like this: python3 <printingScript>         Do not use spaces

    configError?: boolean; //If true, config is invalid
}

interface ElectronAPIInterface {
    executePrintTicket: (client: ClientInterface, printingTicketTemplate: string) => Promise<void>;

    invokeAudioSynthesizer: (client: ClientInterface) => Promise<void>;

    getTranslation: (lang: string) => Promise<{ [key: string]: any }>;
    getAppConfig: () => Promise<AppConfigInterface>;
}

interface Window {
    electronAPI: ElectronAPIInterface;
}
