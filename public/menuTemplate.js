const { openStations, openFileDialog, openNewProject, deactivateProjectDialog, saveFileDialog, climateReference } = require("./actions");

const isMac = process.platform === 'darwin';
// const isDev = require("electron-is-dev");

const menuTemplate = (window) => {
    return [
        {
            label: "Datoteka",
            submenu: [
                { id: "new", label: "Novi projekt", accelerator: "Ctrl+N", click: async () => { await openNewProject(window, false); } },
                { id: "open", label: "Otvori projekt...", accelerator: "Ctrl+O", click: async () => { await openFileDialog(window); } },
                { id: "save", label: "Spremi projekt...", accelerator: "Ctrl+S", enabled: false, click: () => { saveFileDialog(window, false); } },
                { id: "saveas", label: "Spremi projekt kao...", enabled: false, click: () => { saveFileDialog(window, true); } },
                // { type: 'separator' },
                // { id: "options", label: "Postavke projekta...", enabled: false },
                { id: "close", label: "Zatvori projekt...", enabled: false, click: async () => { await deactivateProjectDialog(window); } },
                { type: 'separator' },
                { id: "stations", label: "Lokacije / Postaje...", accelerator: "Ctrl+P", click: async () => { await openStations(window) } },
                { type: 'separator' },
                isMac ? { role: 'close', label: "Zatvori" } : { role: 'quit', label: "Izlaz" }
            ]
        },
        {
            label: 'Prikaz',
            submenu: [
                { role: 'reload', label: "Ponovno učitavanje" },
                // isDev && { role: 'forceReload', label: "Tvrdo ponovno učitavanje" },
                // isDev && { type: 'separator' },
                // isDev && { role: 'toggleDevTools' },
                { type: 'separator' },
                {
                    label: "Zumiranje",
                    submenu: [

                        { role: 'zoomIn', label: "Povećaj (+)" },
                        { role: 'zoomOut', label: "Smanji (-)" },
                        { type: "separator" },
                        { role: 'resetZoom', label: "Poništi" },
                    ]
                },
                { role: 'togglefullscreen', label: "Cijeli zaslon" }
            ]
        },
        {
            role: 'help',
            label: "Pomoć",
            submenu: [             
                {
                    id: "cr",
                    label: "Klimatska referenca", 
                    type: "checkbox", 
                    click: () => {
                       
                        climateReference(window);
                    }
                },
                { type: "separator" },
                { label: "O programu KlimaSoft..." }
            ]
        }
    ];
};
module.exports = menuTemplate;