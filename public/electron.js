// const log = require('electron-log');
// log.transports.file.level = 'info';
// log.transports.file.resolvePath = () => path.join( __dirname, "klimasoft-custom.log");

const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const isDev = require("electron-is-dev");

const path = require("path");
// const url = require("url");

const { openStations, closeStations, openFileDialog, openNewProject, closeNewProject, confirmNewProject,
  deactivateProjectDialog, saveFileData, importFileDialog, importFileDialogClose, confirmImport } = require("./actions");
const global = require("./global");
const menuTemplate = require("./menuTemplate");
const { getStations, initStations } = require("./StationsHR");

// console.log("log", log.transports.file.resolvePath());


// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS;

//lang
app.commandLine.appendSwitch('lang', 'hr');
// app.commandLine.appendSwitch("enable-logging=file");


if (isDev) {
  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
  REDUX_DEVTOOLS = devTools.REDUX_DEVTOOLS;
}

let mainWindow;
// console.log("userData", app.getPath("userData"));

function createWindow() {
  mainWindow = new BrowserWindow({
    title: "Klimasoft",
    width: 1200,
    height: 800,
    minWidth: 1180,
    minHeight: 600,
    icon: path.join(__dirname, "favicon.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const menu = Menu.buildFromTemplate(menuTemplate(mainWindow, global.activeProject));
  Menu.setApplicationMenu(menu);


  // Load from localhost if in development
  // Otherwise load index.html file 
  // if (isDev) {
  //   mainWindow.loadURL("http://localhost:3000");
  // }
  // else {
  //   console.log("PATH", path.join(__dirname, '../build/index.html'));
  //   mainWindow.loadURL(url.format({
  //     pathname: path.join(__dirname, '../build/index.html'),
  //     protocol: 'file:',
  //     slashes: true
  //   }));
  // }
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${__dirname}/../build/index.html`);

  // mainWindow.loadURL(
  //   isDev
  //     ? "http://localhost:3000"
  //     : `file://${path.join(__dirname, "../build/index.html")}`
  // );

  // Open DevTools if in dev mode
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindow.on("closed", () => (mainWindow = null));
}

// Create a new browser window by invoking the createWindow
// function once the Electron application is initialized.
// Install REACT_DEVELOPER_TOOLS as well if isDev
app.whenReady().then(() => {
  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`));
    installExtension(REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`));

  }

  createWindow();


});

// Add a new listener that tries to quit the application when
// it no longer has any open windows. This listener is a no-op
// on macOS due to the operating system's window management behavior.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Add a new listener that creates a new browser window only if
// when the application has no visible windows after being activated.
// For example, after launching the application for the first time,
// or re-launching the already running application.
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


//-----------------------------------------------
//stations dialog
ipcMain.on("open-stations", (e, a) => {
  openStations(mainWindow);
});

ipcMain.on("close-stations", (e, a) => {
  closeStations();
});

//file open dialog
ipcMain.on("open-dialog", async (e, a) => {
  await openFileDialog(mainWindow);
  // e.reply("open-dialog", res)
});

//new project dialog
ipcMain.on("open-new-project", (e, a) => {
  openNewProject(mainWindow, a);
});

ipcMain.on("close-new-project", (e, a) => {
  closeNewProject();
});

ipcMain.on("confirm-new-project", (e, a) => {
  // console.log("confirm-new-project", a);
  global.setActiveProject(a.project);
  confirmNewProject(mainWindow, a.project, a.loadedActive);
});

//get active project
ipcMain.on("get-active-project", (e, a) => {
  e.returnValue = global.activeProject;
});

//deactive project
ipcMain.on("deactive-project", (e, a) => {
  deactivateProjectDialog(mainWindow);
});

ipcMain.on("save-file", (e, res) => {
  // console.log("save-file", res);
  saveFileData(mainWindow, res.data, res.forceDialog);
});

ipcMain.on("import-file", (e, res) => {
  // console.log("save-file", res);
  importFileDialog(mainWindow);
});

ipcMain.on("import-file-close", (e, res) => {
  // console.log("save-file", res);
  importFileDialogClose();
});

ipcMain.on("confirm-import-data", (e, a) => {
  // console.log("confirm-new-project", a);
  confirmImport(mainWindow, a);
});

ipcMain.on("climate-reference", (e, a) => {
  const appmenu = Menu.getApplicationMenu();
  const menu = appmenu.getMenuItemById("cr");
  menu.click();
});

if (getStations().length === 0) {
  initStations();
}