// const isMac = process.platform === 'darwin';
const { BrowserWindow, dialog, app } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

let stations, newproject;

exports.openStations = function (mainWindow) {
    // console.log("STATIONS!");
    const url = isDev
        ? "http://localhost:3000#/stations"
        : `file://${path.join(path.basename(__dirname), "../build/index.html#/stations")}`;

    const mainBounds = mainWindow.getBounds();

    stations = new BrowserWindow({
        title: "Lokacije / Meteorološke postaje",
        width: 600, 
        height: 550,
        minWidth: 400,
        minHeight: 400,
        maxWidth: 1200,
        maxHeight: 1200,
        minimizable: false,
        maximizable: false,
        parent: mainWindow,
        x: mainBounds.x + (mainBounds.width / 2 - 300),
        y: mainBounds.y + (mainBounds.height / 2 - 300),
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


exports.openNewProject = function (mainWindow) {
    // console.log("STATIONS!");
    const url = isDev
        ? "http://localhost:3000#/newproject"
        : `file://${path.join(path.basename(__dirname), "../build/index.html#/newproject")}`;

    // console.log("openStations", mainWindow);
    const mainBounds = mainWindow.getBounds();

    newproject = new BrowserWindow({
        title: "Novi projekt",
        width: 600, //ovo je radi dev toolsa
        height: 550,
        minWidth: 400,
        minHeight: 400,
        maxWidth: 1200,
        maxHeight: 800,
        minimizable: false,
        maximizable: false,
        parent: mainWindow,
        modal: true,
        x: mainBounds.x + (mainBounds.width / 2 - 300),
        y: mainBounds.y + (mainBounds.height / 2 - 300),
        icon: null,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.resolve(__dirname, "../public/preload.js"),
        },
    });
    newproject.setMenu(null);
    newproject.loadURL(url);

    if (isDev) {
        newproject.webContents.toggleDevTools();
    }
}

exports.closeNewProject = function () {
    if (newproject) {
        newproject.close();
    }
}