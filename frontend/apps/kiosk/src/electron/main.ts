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

    let printJob;
    const callParameters = `'${JSON.stringify({
        categoryShortName: client.category.short_name,
        number: client.number,
        template: printingTicketTemplate || "",
    })}'`; //Added ' at the beginning and end of the string to avoid issues with spaces in the parameters
    //TODO check if not remove '

    if (config.printingScriptAddPythonPrefix) {
        printJob = spawnSync("python3", [config.printingScript, callParameters]);
    } else {
        printJob = spawnSync(config.printingScript, [callParameters]);
    }

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

async function handleInvokeAudioSynthesizer(
    _event: IpcMainInvokeEvent,
    client: ClientInterface,
): Promise<void> {
    console.log("Invoking audio synthesizer");
    if (!config.audioSynthesizerScript) {
        console.log("No audio synthesizer script configured");
        return;
    }
    let audioSynthesizer;
    const callParameters = `${JSON.stringify({
        categoryShortName: client.category.short_name,
        number: client.number,
        seat: client.seat,
    })}`;
    if (config.audioSynthesizerScriptAddPythonPrefix) {
        audioSynthesizer = spawnSync("python3", [config.audioSynthesizerScript, callParameters]);
    } else {
        audioSynthesizer = spawnSync(config.audioSynthesizerScript, [callParameters]);
    }
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

    ipcMain.on("executePrintTicket", onExecutePrintTicket);

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
