const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const { openStations, closeStations, openFileDialog, openNewProject, closeNewProject, confirmNewProject } = require("../electron/actions");

const menuTemplate = require("../electron/menuTemplate");
const { getStations, initStations } = require("../src/data/StationsHR");

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS;

//lang
app.commandLine.appendSwitch('lang', 'hr');

if (isDev) {
  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
  REDUX_DEVTOOLS = devTools.REDUX_DEVTOOLS;

}

let mainWindow;
let activeProject;

// console.log("userData", app.getPath("userData"));

function createWindow() {
  mainWindow = new BrowserWindow({
    title: "Klimasoft",
    width: 1100,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, "favicon.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });


  const menu = Menu.buildFromTemplate(menuTemplate(mainWindow, activeProject))
  Menu.setApplicationMenu(menu)

  // Load from localhost if in development
  // Otherwise load index.html file
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open DevTools if in dev mode
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }
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

// The code above has been adapted from a starter example in the Electron docs:
// https://www.electronjs.org/docs/tutorial/quick-start#create-the-main-script-file

ipcMain.on("open-stations", (e, a) => {
  openStations(mainWindow);
});

ipcMain.on("close-stations", (e, a) => {
  closeStations();
});

ipcMain.on("open-dialog", async (e, a) => {
  openFileDialog(mainWindow);
  // e.reply("open-dialog", res)
});

ipcMain.on("open-new-project", (e, a) => {
  console.log("open-new-project", a);
  openNewProject(mainWindow, a);
});

ipcMain.on("close-new-project", (e, a) => {
  closeNewProject();
});

ipcMain.on("confirm-new-project", (e, a) => {
  activeProject = a;
  confirmNewProject(mainWindow, a);

});

ipcMain.on("get-active-project", (e, a) => {
  e.returnValue = activeProject;
});

if (getStations().length === 0) {
  initStations();
}