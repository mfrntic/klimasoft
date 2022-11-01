import { IconContext } from "react-icons";
import { IoFolderOpen, IoAdd } from 'react-icons/io5';
import { MdEngineering } from 'react-icons/md'
import style from "./ProjectNotSelected.module.css";

function ProjectNotSelected() {
    return (
        <div className={style.container}>
            <IconContext.Provider value={{ style: { verticalAlign: "bottom" }, color: "silver", size: "4em" }}>
                <h2><MdEngineering /></h2>
            </IconContext.Provider>
            <IconContext.Provider value={{ style: { verticalAlign: "bottom" } }}>
                Kreirajte <a href="#"><IoAdd /> novi projekt</a> ili <a href="#"><IoFolderOpen /> učitajte datoteku</a> s podacima...
            </IconContext.Provider>
        </div>
    );
}

export default ProjectNotSelected;