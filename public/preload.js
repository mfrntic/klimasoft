const { contextBridge, ipcRenderer } = require("electron");
const { getStations, saveStation, initStations, deleteStation } = require("../src/data/StationsHR");

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

    confirmNewProject: (project) => {
        ipcRenderer.send("confirm-new-project", project);
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
    }
});

