const path = require("path");
const { app, BrowserWindow, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");

let mainWindow;
let localServer;

function setupAutoUpdates() {
    if (!app.isPackaged) return;

    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.on("checking-for-update", () => console.log("Controleren op Xavis Analytics-updates..."));
    autoUpdater.on("update-available", info => console.log(`Update beschikbaar: ${info.version}`));
    autoUpdater.on("update-not-available", () => console.log("Xavis Analytics is up-to-date."));
    autoUpdater.on("error", error => console.error("Auto-update mislukt:", error));
    autoUpdater.on("update-downloaded", () => {
        console.log("Update gedownload. De update wordt geïnstalleerd wanneer de app wordt afgesloten.");
    });

    autoUpdater.checkForUpdates().catch(error => {
        console.error("Auto-update controleren mislukt:", error);
    });
}

const gotSingleInstanceLock = app.requestSingleInstanceLock();

async function createMainWindow() {
    if (mainWindow) {
        mainWindow.focus();
        return;
    }

    if (!localServer) {
        const { startServer } = require(path.join(__dirname, "..", "server.js"));
        localServer = await startServer(0, "127.0.0.1");
    }

    const port = localServer.address().port;
    mainWindow = new BrowserWindow({
        width: 1440,
        height: 960,
        minWidth: 1000,
        minHeight: 700,
        backgroundColor: "#050805",
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        }
    });

    await mainWindow.loadURL(`http://127.0.0.1:${port}/`);
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

if (!gotSingleInstanceLock) {
    app.quit();
} else {
    app.on("second-instance", () => {
        if (!mainWindow) return;
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    });

    app.whenReady().then(async () => {
        process.env.XAVIS_DATA_DIR = path.join(app.getPath("userData"), "data");

        try {
            setupAutoUpdates();
            await createMainWindow();
        } catch (error) {
            console.error("Xavis Analytics kon niet starten:", error);
            await dialog.showMessageBox({
                type: "error",
                title: "Xavis Analytics",
                message: "De lokale server kon niet worden gestart.",
                detail: error.message
            });
            app.quit();
        }
    });

    app.on("before-quit", () => {
        if (localServer) localServer.close();
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });

    app.on("activate", () => {
        createMainWindow().catch(error => {
            console.error("Xavis Analytics kon niet opnieuw openen:", error);
        });
    });
}
