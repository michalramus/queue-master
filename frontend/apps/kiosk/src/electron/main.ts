import { spawn } from "child_process";
import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import { networkInterfaces } from "os";
import path from "path";
import { ClientInterface } from "shared-utils";

let config: AppConfigInterface;
let mainWindow: BrowserWindow;

/**
 * Execute external script asynchronously
 * @param scriptPath path to script
 * @param scriptName only for logging purposes
 * @param scriptArgs arguments to script
 */
async function executeScript(
    scriptPath: string,
    scriptName: string,
    scriptArgs: string[] = [],
): Promise<void> {
    const scriptProcess = spawn(scriptPath, scriptArgs);

    scriptProcess.stdout?.on("data", (data: Buffer) => {
        if (process.env.NODE_ENV == "development" && data.length > 0) {
            console.log(data.toString());
        }
    });

    scriptProcess.stderr?.on("data", (data: Buffer) => {
        if (data.length > 0) {
            console.error(data.toString());
        }
    });

    scriptProcess.on("close", (code: number) => {
        console.log(`Script ${scriptName} ended with ${code}`);
    });
}

//IPC --------------------------------

async function onExecutePrintTicket(
    _event: IpcMainInvokeEvent,
    client: ClientInterface,
    printingTicketTemplate: string,
): Promise<void> {
    console.log("Printing ticket");
    if (!config.printingScript) {
        console.log("No printing script configured");
        return;
    }

    const callParameters = `${JSON.stringify({
        categoryShortName: client.category.short_name,
        number: client.number,
        queueLength: client.queue_length || "",
        template: printingTicketTemplate || "",
    })}`;

    executeScript(config.printingScript, "printingScript", [callParameters]);
}

async function onExecuteOpenKioskScript(_event: IpcMainInvokeEvent): Promise<void> {
    if (!config.openingHoursOpenScript) {
        console.log("No opening script configured");
        return;
    }

    executeScript(config.openingHoursOpenScript, "openingHoursOpenScript");
}

async function onExecuteCloseKioskScript(_event: IpcMainInvokeEvent): Promise<void> {
    if (!config.openingHoursCloseScript) {
        console.log("No closing script configured");
        return;
    }

    executeScript(config.openingHoursCloseScript, "openingHoursCloseScript");
}

function handleInvokeAudioSynthesizer(_event: IpcMainInvokeEvent, client: ClientInterface): void {
    console.log("Invoking audio synthesizer");
    if (!config.audioSynthesizerScript) {
        console.log("No audio synthesizer script configured");
        mainWindow.webContents.send("audioSynthesizerComplete");
        return;
    }

    const callParameters = `${JSON.stringify({
        categoryShortName: client.category.short_name,
        number: client.number,
        desk: client.desk,
        language: client.language,
    })}`;

    const proc = spawn(config.audioSynthesizerScript, [callParameters]);

    proc.stdout?.on("data", (data: Buffer) => {
        if (process.env.NODE_ENV == "development" && data.length > 0) {
            console.log(data.toString());
        }
    });

    proc.stderr?.on("data", (data: Buffer) => {
        if (data.length > 0) {
            console.error(data.toString());
        }
    });

    proc.on("close", (code: number | null) => {
        console.log(`Audio synthesizer script ended with ${code}`);
        mainWindow.webContents.send("audioSynthesizerComplete");
    });
}

async function handleGetTranslation(
    _event: IpcMainInvokeEvent,
    lang: string,
): Promise<{ [key: string]: any }> {
    const i18nPath: string = path.join(
        app.getAppPath(),
        process.env.NODE_ENV == "development" ? "../.." : "..",
        `/i18n/${lang}.json`,
    );

    try {
        const translation = await import(i18nPath, { with: { type: "json" } });
        return translation.default;
    } catch (e) {
        console.error(e);
        return {};
    }
}

async function handleGetAppConfig(): Promise<AppConfigInterface> {
    return config;
}

function handleGetLocalIpAddress(): string {
    const nets = networkInterfaces();
    for (const iface of Object.values(nets)) {
        if (!iface) continue;
        for (const net of iface) {
            if (net.family === "IPv4" && !net.internal) {
                return net.address;
            }
        }
    }
    return "Unknown";
}

// -----------------------------------
function createWindow(zoomFactor: number = 1) {
    const isDevelopment = process.env.NODE_ENV == "development";
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: 800,
        height: 600,
        fullscreen: !isDevelopment, // Enable fullscreen in production
        webPreferences: {
            preload: path.join(
                app.getAppPath(),
                isDevelopment ? "." : "..",
                "/dist-electron/preload.cjs",
            ),
        },
    });

    //Output devtools logs to main process console output
    mainWindow.webContents.on("console-message", (event) => {
        const { level, message, lineNumber, sourceId } = event;
        const origin = sourceId ? `${sourceId}:${lineNumber}` : "renderer";
        if (level === "error") {
            console.error(`[renderer] ${message} (${origin})`);
        } else if (level === "warning") {
            console.warn(`[renderer] ${message} (${origin})`);
        } else if (level === "info") {
            console.log(`[renderer] ${message} (${origin})`);
        } else if (isDevelopment) {
            console.debug(`[renderer] ${message} (${origin})`);
        }
    });

    if (zoomFactor && zoomFactor > 0) {
        console.log("Setting zoom factor to", zoomFactor);
        mainWindow.webContents.on("did-finish-load", () => {
            mainWindow.webContents.setZoomFactor(zoomFactor || 1);
        });
    }

    // Enable user zoom controls (Ctrl/Cmd + +/-/0)
    // mainWindow.webContents.setVisualZoomLevelLimits(1, 3); // Allow zoom between 100% and 300%
    // mainWindow.webContents.setZoomLevel(0); // Default zoom level

    if (isDevelopment) {
        mainWindow.loadURL("http://localhost:5123");
    } else {
        mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"));
    }
}

async function fetchConfig() {
    const configPath = path.resolve(process.argv[process.argv.length - 1]);

    //TODO: Use config engine
    try {
        const _config = await import(configPath, { with: { type: "json" } });
        //TODO: validate config
        config = _config.default;
        config.backendUrl = config.backendUrl.replace(/\/$/, "") + "/api"; //Add /api backend prefix
    } catch (e) {
        console.error(e);
        config = { configError: true } as AppConfigInterface;
    }
}

app.on("ready", async () => {
    await fetchConfig();

    ipcMain.on("executePrintTicket", onExecutePrintTicket);
    ipcMain.on("executeOpenKioskScript", onExecuteOpenKioskScript);
    ipcMain.on("executeCloseKioskScript", onExecuteCloseKioskScript);

    ipcMain.handle("invokeAudioSynthesizer", handleInvokeAudioSynthesizer);

    //TODO: refactor to use invoke with handle name convention
    ipcMain.handle("getTranslation", handleGetTranslation);
    ipcMain.handle("getAppConfig", handleGetAppConfig);
    ipcMain.handle("getLocalIpAddress", handleGetLocalIpAddress);

    createWindow(config.zoomFactor);

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow(config.zoomFactor);
        }
    });
});
