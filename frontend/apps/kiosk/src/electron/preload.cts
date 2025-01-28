import { contextBridge } from "electron/renderer";

contextBridge.exposeInMainWorld("electron", {
    // executePrintScript: () => {},
});
