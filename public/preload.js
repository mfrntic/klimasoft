const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    openStations: () => {
        ipcRenderer.send("open-stations");
    } 
});
