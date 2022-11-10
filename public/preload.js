const { contextBridge, ipcRenderer } = require("electron");
const { getStations, saveStation, initStations, deleteStation } = require("../src/data/StationsHR");
const { clipboard } = require('electron')

contextBridge.exposeInMainWorld("api", {
    openStations: () => {
        ipcRenderer.send("open-stations");
    },

    closeStations: () => {
        ipcRenderer.send("close-stations");
    },

    openNewProject: (loadactive) => {
        ipcRenderer.send("open-new-project", loadactive);
    },

    closeNewProject: () => {
        ipcRenderer.send("close-new-project");
    },

    openFileDialog: () => {
        ipcRenderer.send("open-dialog");
    },

    openFileDialogHandler: (callback) => {
        ipcRenderer.removeAllListeners("open-dialog-handler")
        ipcRenderer.on("open-dialog-handler", callback);
    },

    confirmNewProject: (project, loadedActive) => {
        ipcRenderer.send("confirm-new-project", { project, loadedActive });
    },

    confirmNewProjectHandler: (callback) => {
        ipcRenderer.removeAllListeners("new-project-handler")
        ipcRenderer.on("new-project-handler", callback);
    },

    initStations: () => {
        return initStations();
    },

    getStations: () => {
        return getStations();
    },

    saveStation: (station) => {
        saveStation(station);
    },

    deleteStation: (station) => {
        deleteStation(station);
    },

    getActiveProject: () => {
        const res = ipcRenderer.sendSync("get-active-project")
        return res;
    },

    deactivateProject: () => {
        ipcRenderer.send("deactivate-project");
    },

    deactivateProjectHandler: (callback) => {
        ipcRenderer.removeAllListeners("deactivated-project")
        ipcRenderer.on("deactivated-project", callback);
    },

    saveFileData: (data) => {
        ipcRenderer.send("save-file", data);
    },

    getClipboardData: () => {
        return clipboard.readText();
    }
});

