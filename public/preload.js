const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    openStations: () => {
        ipcRenderer.send("open-stations");
    },

    closeStations: () => {
        ipcRenderer.send("close-stations");
    },

    openNewProject: () =>{
        ipcRenderer.send("open-new-project");
    },

    closeNewProject: () =>{
        ipcRenderer.send("close-new-project");
    },

    openFileDialog: () => {
        ipcRenderer.send("open-dialog");
    },

    openFileDialogHandler: (callback) => {
        ipcRenderer.removeAllListeners("open-dialog-handler")
        ipcRenderer.on("open-dialog-handler", callback);
    }
});

