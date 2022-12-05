const { openStations, openFileDialog, openNewProject, deactivateProjectDialog, saveFileDialog, climateReference } = require("./actions");

const isMac = process.platform === 'darwin';
const isDev = require("electron-is-dev");
const { Menu } = require("electron");

const menuTemplate = (window) => {
    return [
        // // { role: 'appMenu' }
        // ...(isMac ? [{
        //     label: app.name,
        //     submenu: [
        //         { role: 'about' },
        //         { type: 'separator' },
        //         { role: 'services' },
        //         { type: 'separator' },
        //         { role: 'hide' },
        //         { role: 'hideOthers' },
        //         { role: 'unhide' },
        //         { type: 'separator' },
        //         { role: 'quit' }
        //     ]
        // }] : []),
        // { role: 'fileMenu' }
        {
            label: "Datoteka",
            submenu: [
                { id: "new", label: "Novi projekt", accelerator: "Ctrl+N", click: () => { openNewProject(window, false); } },
                { id: "open", label: "Otvori projekt...", accelerator: "Ctrl+O", click: () => { openFileDialog(window); } },
                { id: "save", label: "Spremi projekt...", accelerator: "Ctrl+S", enabled: false, click: () => { saveFileDialog(window, false); } },
                { id: "saveas", label: "Spremi projekt kao...", enabled: false, click: () => { saveFileDialog(window, true); } },
                // { type: 'separator' },
                // { id: "options", label: "Postavke projekta...", enabled: false },
                { id: "close", label: "Zatvori projekt...", enabled: false, click: () => { deactivateProjectDialog(window); } },
                { type: 'separator' },
                { id: "stations", label: "Lokacije / Postaje...", accelerator: "Ctrl+P", click: () => { openStations(window) } },
                { type: 'separator' },
                isMac ? { role: 'close', label: "Zatvori" } : { role: 'quit', label: "Izlaz" }
            ]
        },
        // { role: 'editMenu' }
        // {
        //     label: 'Uređivanje',
        //     submenu: [
        //         { role: 'undo', label: "Poništi" },
        //         { role: 'redo', label: "Ponovi poništeno" },
        //         { type: 'separator' },
        //         { role: 'cut', label: "Izreži" },
        //         { role: 'copy', label: "Kopiraj" },
        //         { role: 'paste', label: "Zalijepi" },
        //         ...(isMac ? [
        //             { role: 'pasteAndMatchStyle', label: "Zalijepi i sačuvaj stil" },
        //             // { role: 'delete' },
        //             { role: 'selectAll', label: "Odaberi sve"  },
        //             { type: 'separator' },
        //             {
        //                 label: 'Speech',
        //                 submenu: [
        //                     { role: 'startSpeaking' },
        //                     { role: 'stopSpeaking' }
        //                 ]
        //             }
        //         ] : [
        //             // { role: 'delete', label: "Obriši" },
        //             { type: 'separator' },
        //             { role: 'selectAll', label: "Odaberi sve" }
        //         ])
        //     ]
        // },
        // { role: 'viewMenu' }
        {
            label: 'Prikaz',
            submenu: [
                { role: 'reload', label: "Ponovno učitavanje" },
                isDev && { role: 'forceReload', label: "Tvrdo ponovno učitavanje" },
                isDev && { type: 'separator' },
                isDev && { role: 'toggleDevTools' },
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
        // { role: 'windowMenu' }
        // {
        //     label: 'Window',
        //     submenu: [
        //         { role: 'minimize' },
        //         { role: 'zoom' },
        //         ...(isMac ? [
        //             { type: 'separator' },
        //             { role: 'front' },
        //             { type: 'separator' },
        //             { role: 'window' }
        //         ] : [
        //             // { role: 'close' }
        //         ])
        //     ]
        // },
        {
            role: 'help',
            label: "Pomoć",
            submenu: [
                // {
                //     label: 'Upute za rad s programom',
                //     click: async () => {
                //         // const { shell } = require('electron')
                //         // await shell.openExternal('https://electronjs.org')
                //     }
                // },
                {
                    id: "cr",
                    label: "Klimatska referenca", 
                    type: "checkbox", 
                    click: () => {
                       
                        climateReference(window);
                    }
                },
                { type: "separator" },
                { label: "O programu \"KlimaSoft\"..." }
            ]
        }
    ];
};
module.exports = menuTemplate;