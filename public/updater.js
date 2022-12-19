const { dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
 

//configure log debugging
autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"
autoUpdater.autoDownload = false;

module.exports = (mainWindow) => {
    //check for updates
    autoUpdater.checkForUpdates();

    //listen to event
    autoUpdater.on("update-available", async (info) => {
        //prompt user to start download
        const res = await dialog.showMessageBox({
            type: "info",
            title: "Nadogradnja",
            message: "Nova verzija Klimasofta je dostupna. Želite li nadograditi?",
            buttons: ["Nadogradi", "Odustani"]
        });
        if (res.response === 0) {
            mainWindow.webContents.send("update-progress", `Priprema aplikacije za nadogradnju... Pričekajte...`);
            autoUpdater.downloadUpdate();
        }
    });

    autoUpdater.on("download-progress", (progressInfo) => {
        mainWindow.webContents.send("update-progress", `Preuzimanje nadogradnje... ${progressInfo.percent.toFixed(1)}%`);
        // console.log(progressInfo.percent);
    });

    autoUpdater.on("update-downloaded", async () => {
        //Prompt the user to install the update
        const res = await dialog.showMessageBox({
            type: "info",
            title: "Nadogradnja je spremna!",
            message: "Želite li nadograditi Klimasoft odmah i ponovo pokrenuti aplikaciju, ili kasnije, prilikom slijedećeg pokretanja aplikacije?",
            buttons: ["Nadogradi odmah", "Nadogradi kasnije"]
        });

        if (res.response === 0) {
            autoUpdater.quitAndInstall(false, true);
        }
        mainWindow.webContents.send("update-progress", "finished");
    });
}