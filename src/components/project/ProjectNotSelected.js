import { IconContext } from "react-icons";
import { IoFolderOpen, IoAdd } from 'react-icons/io5';
import { MdEngineering } from 'react-icons/md'
import style from "./ProjectNotSelected.module.css";

function ProjectNotSelected() {

    function openNewProjectHandler(){
        window.api.openNewProject(false);
    }

    return (
        <div className={style.container}>
            <IconContext.Provider value={{ style: { verticalAlign: "bottom" }, color: "silver", size: "4em" }}>
                <h2><MdEngineering /></h2>
            </IconContext.Provider>
            <IconContext.Provider value={{ style: { verticalAlign: "bottom" } }}>
                Kreirajte <span className={style.link} onClick={openNewProjectHandler}><IoAdd />novi projekt</span> ili <span className={style.link} onClick={window.api.openFileDialog}><IoFolderOpen /> učitajte datoteku</span> s podacima...
            </IconContext.Provider>
        </div>
    );
}

export default ProjectNotSelected;