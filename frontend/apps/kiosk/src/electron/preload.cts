import { contextBridge, ipcRenderer } from "electron/renderer";
import { ClientInterface } from "shared-utils";

contextBridge.exposeInMainWorld("electronAPI", {
    executePrintTicket: (client: ClientInterface, printingTicketTemplate: string) => ipcRenderer.send("executePrintTicket", client, printingTicketTemplate),
    
    invokeAudioSynthesizer: (client: ClientInterface) => ipcRenderer.invoke("invokeAudioSynthesizer", client),

    getTranslation: (lang: string): Promise<{ [key: string]: any }> =>
        ipcRenderer.invoke("getTranslation", lang),
    getAppConfig: (): Promise<AppConfigInterface> => ipcRenderer.invoke("getAppConfig"),
});
