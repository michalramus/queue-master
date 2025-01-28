import { app, BrowserWindow } from "electron";
import path from "path";

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

app.on("ready", () => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
