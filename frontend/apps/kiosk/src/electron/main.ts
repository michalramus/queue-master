import { spawnSync } from "child_process";
import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import path from "path";
import { ClientInterface } from "shared-utils";

let config: AppConfigInterface;

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

    const printJob = spawnSync(config.printingScript, [callParameters]);

    if (process.env.NODE_ENV == "development") {
        if (printJob.stdout) {
            console.log(printJob.stdout.toString());
        }

        if (printJob.stderr) {
            console.error(printJob.stderr.toString());
        }
    }

    console.log(`Printing script ended with ${printJob.status}`);
}

async function onExecuteOpenKioskScript(_event: IpcMainInvokeEvent): Promise<void> {
    const openJob = spawnSync(config.opening_hours_open_script || "echo");

    if (process.env.NODE_ENV == "development") {
        if (openJob.stdout) {
            console.log(openJob.stdout.toString());
        }

        if (openJob.stderr) {
            console.error(openJob.stderr.toString());
        }
    }

    console.log(`Opening hours script ended with ${openJob.status}`);
}

async function onExecuteCloseKioskScript(_event: IpcMainInvokeEvent): Promise<void> {
    const closeJob = spawnSync(config.opening_hours_close_script || "echo");

    if (process.env.NODE_ENV == "development") {
        if (closeJob.stdout) {
            console.log(closeJob.stdout.toString());
        }

        if (closeJob.stderr) {
            console.error(closeJob.stderr.toString());
        }
    }

    console.log(`Closing hours script ended with ${closeJob.status}`);
}

async function handleInvokeAudioSynthesizer(
    _event: IpcMainInvokeEvent,
    client: ClientInterface,
): Promise<void> {
    console.log("Invoking audio synthesizer");
    if (!config.audioSynthesizerScript) {
        console.log("No audio synthesizer script configured");
        return;
    }

    const callParameters = `${JSON.stringify({
        categoryShortName: client.category.short_name,
        number: client.number,
        seat: client.seat,
    })}`;

    const audioSynthesizer = spawnSync(config.audioSynthesizerScript, [callParameters]);

    if (process.env.NODE_ENV == "development") {
        if (audioSynthesizer.stdout) {
            console.log(audioSynthesizer.stdout.toString());
        }

        if (audioSynthesizer.stderr) {
            console.error(audioSynthesizer.stderr.toString());
        }
    }
    console.log(`Audio synthesizer script ended with ${audioSynthesizer.status}`);
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

// -----------------------------------
function createWindow() {
    const isDevelopment = process.env.NODE_ENV == "development";
    const mainWindow = new BrowserWindow({
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

    ipcMain.handle("getTranslation", handleGetTranslation);
    ipcMain.handle("getAppConfig", handleGetAppConfig);

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
