import { contextBridge, ipcRenderer } from "electron/renderer";
import { ClientInterface } from "shared-utils";

//Remember to add methods definitions to types.d.ts

contextBridge.exposeInMainWorld("electronAPI", {
    executePrintTicket: (client: ClientInterface, printingTicketTemplate: string) =>
        ipcRenderer.send("executePrintTicket", client, printingTicketTemplate),
    executeOpenKioskScript: () => ipcRenderer.send("executeOpenKioskScript"),
    executeCloseKioskScript: () => ipcRenderer.send("executeCloseKioskScript"),

    invokeAudioSynthesizer: (client: ClientInterface) =>
        ipcRenderer.invoke("invokeAudioSynthesizer", client),
    onAudioSynthesizerComplete: (callback: () => void) => {
        ipcRenderer.on("audioSynthesizerComplete", callback);
        return () => ipcRenderer.removeListener("audioSynthesizerComplete", callback);
    },

    getTranslation: (lang: string): Promise<{ [key: string]: any }> =>
        ipcRenderer.invoke("getTranslation", lang),
    getAppConfig: (): Promise<AppConfigInterface> => ipcRenderer.invoke("getAppConfig"),
    getLocalIpAddress: (): Promise<string> => ipcRenderer.invoke("getLocalIpAddress"),
});
