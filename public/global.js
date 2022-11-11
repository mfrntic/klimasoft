const { Menu } = require("electron");

global.activeProject = null;
global.filePath = null;
//set active project (internal)
global.setActiveProject = function (active) {
    global.activeProject = active;
    //menus
    const appmenu = Menu.getApplicationMenu();
    if (active) {
        //enable save etc...
        appmenu.getMenuItemById("save").enabled = true;
        appmenu.getMenuItemById("close").enabled = true;
        appmenu.getMenuItemById("saveas").enabled = true;
    }
    else {
        //disable save etc...
        appmenu.getMenuItemById("save").enabled = false;
        appmenu.getMenuItemById("close").enabled = false;
        appmenu.getMenuItemById("saveas").enabled = false;
    }
}

module.exports = global;