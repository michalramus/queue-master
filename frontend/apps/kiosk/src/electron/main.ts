import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import path from "path";

let config: AppConfigInterface;

//IPC --------------------------------

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

// -----------------------------------
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(
                app.getAppPath(),
                process.env.NODE_ENV == "development" ? "." : "..",
                "/dist-electron/preload.cjs",
            ),
        },
    });

    if (process.env.NODE_ENV == "development") {
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
    } catch (e) {
        console.error(e);
        config = { configError: true } as AppConfigInterface;
    }
}

app.on("ready", async () => {
    await fetchConfig();

    ipcMain.handle("getTranslation", handleGetTranslation);
    ipcMain.handle("getAppConfig", handleGetAppConfig);

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
