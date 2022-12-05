// const isMac = process.platform === 'darwin';
const { BrowserWindow, dialog, app, Menu } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const global = require("./global");
const fs = require("fs");

let stations, newproject;

exports.openStations = async function (mainWindow) {

    // console.log("STATIONS!");
    // const url = isDev
    //     ? "http://localhost:3000#/stations"
    //     : `file://${path.join(path.basename(__dirname), "../build/index.html#/stations")}`;
    const url = isDev ? 'http://localhost:3000#/stations' : `file://${__dirname}/../build/index.html#/stations`;

    const mainBounds = mainWindow.getBounds();

    stations = new BrowserWindow({
        title: "Lokacije / Meteorološke postaje",
        width: 600,
        height: 575,
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
            preload: path.resolve(__dirname, "./preload.js"),
        },
    });
    stations.setMenu(null);
    stations.loadURL(url);

    // if (isDev) {
    //     stations.webContents.toggleDevTools();
    // }
}

exports.closeStations = function () {
    if (stations) {
        stations.close();
    }
}


exports.openFileDialog = async (mainWindow) => {
    // console.log("openFileDialog", global.activeProject);
    if (global.activeProject) { //ako je otvaranje potpuno novog projekta prvo deaktiviraj stari
        if (!await exports.deactivateProjectDialog(mainWindow)) return;
    }

    const res = await dialog.showOpenDialog(mainWindow, {
        title: "Otvori projekt",
        defaultPath: app.getPath("documents"),
        filters: [
            { name: 'Klimasoft projekt', extensions: ['cldata'] },
            { name: 'Sve datoteke', extensions: ['*'] }
        ]
    });
    if (!res.canceled) {
        const proj = JSON.parse(fs.readFileSync(res.filePaths[0]));
        global.setActiveProject(proj);
        global.filePath = res.filePaths[0];
        mainWindow.webContents.send("open-dialog-handler", {
            filePath: res.filePaths[0],
            project: proj
        });
    }

    // mainWindow.webContents.send("open-dialog", res);
}


exports.openNewProject = async function (mainWindow, loadactive = true) {
    if (!loadactive && global.activeProject) { //ako je otvaranje potpuno novog projekta prvo deaktiviraj stari
        if (!await exports.deactivateProjectDialog(mainWindow)) return;
    }
    //console.log("loadactive-", loadactive);
    // const url = isDev
    //     ? "http://localhost:3000#/newproject?loadactive=" + loadactive
    //     : `file://${path.join(path.basename(__dirname), "../build/index.html#/newproject?loadactive=" + loadactive)}`;
    const url = isDev ? "http://localhost:3000#/newproject?loadactive=" + loadactive : `file://${__dirname}/../build/index.html#/newproject?loadactive=${loadactive}`;


    // console.log("openStations", mainWindow);
    const mainBounds = mainWindow.getBounds();

    newproject = new BrowserWindow({
        title: loadactive ? "Postavke projekta" : "Novi projekt",
        width: 600, //ovo je radi dev toolsa
        height: 575,
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
            preload: path.resolve(__dirname, "./preload.js"),
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

exports.confirmNewProject = async (mainWindow, project, loadedActive) => {
    mainWindow.webContents.send("new-project-handler", { project, loadedActive });
    exports.closeNewProject();
}

exports.deactivateProjectDialog = async (mainWindow) => {
    const res = await dialog.showMessageBox(mainWindow, {
        type: "none",
        title: "Aktivni projekt",
        message: "Da li ste sigurni da želite zatvoriti aktivan projekt?",
        buttons: ["Deaktiviraj", "Odustani"]
    });
    if (res.response === 0) {
        //deaktivacija projekta
        global.setActiveProject(null);
        global.filePath = null;
        mainWindow.webContents.send("deactivated-project");
        return true;
    }
    return false;
}
exports.saveFileDialog = (mainWindow, forceDialog) => {
    // console.log("saveFileDialog", forceDialog);
    mainWindow.webContents.send("save-file-dialog", forceDialog);
}

exports.saveFileData = async (mainWindow, fileContents, forceDialog = true) => {
    // console.log(fileContents);
    const proj = JSON.parse(fileContents);
    let res = {
        filePath: global.filePath,
        canceled: false
    }
    if (!global.filePath || forceDialog) {
        res = await dialog.showSaveDialog(mainWindow, {
            title: "Spremi projekt",
            defaultPath: path.join(app.getPath("documents"), proj.header.projectName + ".cldata"),
            filters: [
                { name: 'Klimasoft projekt', extensions: ['cldata'] },
                { name: 'Sve datoteke', extensions: ['*'] }
            ]
        });
    }
    if (!res.canceled) {
        const filePath = res.filePath;
        global.filePath = filePath;
        fs.writeFile(filePath, fileContents, (err) => {
            if (err) throw err;
        });
    }
}

let importDialog;

exports.importFileDialogClose = () => {
    if (importDialog) {
        importDialog.close();
    }
}

exports.importFileDialog = async (mainWindow) => {
    const res = await dialog.showOpenDialog(mainWindow, {
        title: "Uvoz podataka",
        defaultPath: app.getPath("documents"),
        filters: [
            { name: 'Očekivani formati za uvoz', extensions: ['txt', 'dat'] },
            { name: 'Sve datoteke', extensions: ['*'] }
        ]
    });
    if (!res.canceled) {
        const txt = fs.readFileSync(res.filePaths[0], 'utf8');

        //otvori browser window za import
        // console.log("STATIONS!");
        const url = isDev
            ? "http://localhost:3000#/import"
            : `file://${__dirname}/../build/index.html#/import`;
        // const url = isDev ? "http://localhost:3000#/newproject?loadactive=" + loadactive : `file://${__dirname}/../build/index.html#//newproject?loadactive=${loadactive}`;

        const mainBounds = mainWindow.getBounds();


        importDialog = new BrowserWindow({
            title: "Uvoz podataka: " + res.filePaths[0],
            width: 890,
            height: 575,
            minWidth: 400,
            minHeight: 400,
            // maxWidth: 1200,
            // maxHeight: 1200,
            // minimizable: false,
            // maximizable: false,
            parent: mainWindow,
            x: mainBounds.x + (mainBounds.width / 2 - 890 / 2),
            y: mainBounds.y + (mainBounds.height / 2 - 575 / 2),
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                preload: path.resolve(__dirname, "./preload.js"),
            },
        });

        if (isDev) {
            importDialog.webContents.toggleDevTools();
        }

        importDialog.setMenu(null);
        importDialog.loadURL(url);

        importDialog.webContents.on("did-finish-load", () => {
            importDialog.webContents.send("import-file", txt);
        });


    }
}


exports.confirmImport = async (mainWindow, data) => {
    mainWindow.webContents.send("import-data-handler", data);
    // console.log("import-data-handler", data);
    exports.importFileDialogClose();
}


exports.climateReference = function (mainWindow) {
    const appmenu = Menu.getApplicationMenu();
    const m = appmenu.getMenuItemById("cr");

    mainWindow.webContents.send("climate-reference", m.checked);
}