const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    sendTestMessage: (message) => {
        ipcRenderer.send("test", message);
    }
});
