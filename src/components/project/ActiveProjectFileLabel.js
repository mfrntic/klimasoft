import style from "./ActiveProjectFileLabel.module.css";

function ActiveProjectFileLabel({ activeProject }) {

    function onActiveLabelClickHandler() {
        if (activeProject.header.isValid()) {
            //ako je ok onda otvori properties aktivnog projekta
            window.api.openNewProject(true);
        }
        else {
            window.api.openFileDialog();
        }
    }

    return (
        <div title="" onClick={onActiveLabelClickHandler} className={style.activeProjectLabel}>
            {activeProject.header.isValid() ? activeProject.header.projectName + ".cldata *" : "[ NOVI PROJEKT (*.cldata) ]"}
        </div>
    );
}

export default ActiveProjectFileLabel;