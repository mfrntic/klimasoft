
import { IconContext } from "react-icons";
import { IoBarChart, IoApps, IoFolderOpen, IoAdd, IoSave } from 'react-icons/io5';
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Project from "../../models/klimasoft-project";
import ActiveProjectFileLabel from "./ActiveProjectFileLabel";
import style from "./ProjectMenu.module.css";

function ProjectMenu() {

    const activeProjectData = useSelector(a => a.project);
    //console.log("activeProjectData", activeProjectData);
    const activeProject = Project.fromObject(activeProjectData);
    // console.log("isValid", activeProject.header.isValid(), activeProject);


    function openNewProjectHandler() {
        window.api.openNewProject(false);
    }

    function saveFileDataHandler() {
        window.api.saveFileData(JSON.stringify(activeProjectData, null, 2));
    }

    return (
        <IconContext.Provider value={{ size: "1.25em", className: style.icons }}>
            <ul className={style.topnav}>
                <li className={style.title}>
                    <ActiveProjectFileLabel activeProject={activeProject} />
                    <div className={style.commands}>
                        <button type="button" title="Novi projekt" onClick={openNewProjectHandler}>
                            <IoAdd />
                        </button>
                        <button type="button" title="Otvori projekt (*.cldata)" onClick={window.api.openFileDialog}>
                            <IoFolderOpen />
                        </button>
                        <button type="button" title="Spremi" 
                            disabled={!activeProject.header.isValid()} 
                            className={style.primary} 
                            onClick={saveFileDataHandler}>
                            <IoSave />
                        </button>
                    </div>
                </li>
                <li className={`${style.right}`}>
                    <NavLink to="/report" className={(navdata) => navdata.isActive ? style.active : null}>
                        <IoBarChart /> Izračuni
                    </NavLink>

                </li>
                <li className={style.right}>
                    <NavLink to="/data" className={(navdata) => navdata.isActive ? style.active : null}>
                        <IoApps /> Podaci
                    </NavLink>


                </li>
            </ul>
        </IconContext.Provider>
    );
}

export default ProjectMenu;