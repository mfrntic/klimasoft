// const isMac = process.platform === 'darwin';
const { BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");


exports.openStations = function (mainWindow) {
    // console.log("STATIONS!");
    const url = isDev
        ? "http://localhost:3000#/stations"
        : `file://${path.join(__dirname, "../build/index.html#/stations")}`;

    // console.log("openStations", mainWindow);

    const stations = new BrowserWindow({
        title: "Lokacije / Meteorološke postaje",
        width: 600,
        height: 600,
        minWidth: 400,
        minHeight: 400,
        maxWidth: 1200,
        maxHeight: 1200,
        minimizable: false,
        maximizable: false,
        parent: mainWindow
    });
    stations.setMenu(null);
    stations.loadURL(url);

}