// const isMac = process.platform === 'darwin';
const { BrowserWindow, dialog, app } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

let stations;

exports.openStations = function (mainWindow) {
    // console.log("STATIONS!");
    const url = isDev
        ? "http://localhost:3000#/stations"
        : `file://${path.join(path.basename(__dirname), "../build/index.html#/stations")}`;

    // console.log("openStations", mainWindow);

    stations = new BrowserWindow({
        title: "Lokacije / Meteorološke postaje",
        width: isDev ? 1000 : 600, //ovo je radi dev toolsa
        height: 600,
        minWidth: 400,
        minHeight: 400,
        maxWidth: 1200,
        maxHeight: 1200,
        minimizable: false,
        maximizable: false,
        parent: mainWindow,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.resolve(__dirname, "../public/preload.js"),
        },
    });
    stations.setMenu(null);
    stations.loadURL(url);

    if (isDev) {
        stations.webContents.toggleDevTools();
    }
}

exports.closeStations = function () {
    if (stations) {
        stations.close();
    }
}

exports.openFileDialog = async (mainWindow) => {
    const res = await dialog.showOpenDialog(mainWindow, {
        title: "Otvori datoteku",
        defaultPath: app.getPath("documents"),
        filters: [
            { name: 'Klimasoft', extensions: ['cld', 'kld', 'json'] },
            { name: 'Sve datoteke', extensions: ['*'] }
        ]
    });
    mainWindow.webContents.send("open-dialog-handler", res);
    // mainWindow.webContents.send("open-dialog", res);
}