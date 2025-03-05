import { contextBridge, ipcRenderer } from "electron/renderer";

contextBridge.exposeInMainWorld("electronAPI", {
    // executePrintScript: () => {},
    getTranslation: (lang: string): Promise<{ [key: string]: any }> =>
        ipcRenderer.invoke("getTranslation", lang),
    getAppConfig: (): Promise<AppConfigInterface> => ipcRenderer.invoke("getAppConfig"),
});
