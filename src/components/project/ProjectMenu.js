
import { IconContext } from "react-icons";
import { IoBarChart, IoApps, IoFolderOpen, IoAdd, IoSave } from 'react-icons/io5';
import { NavLink } from "react-router-dom";
import style from "./ProjectMenu.module.css";

function ProjectMenu() {

    function openNewProjectHandler() {
        window.api.openNewProject(false);
    }

    return (
        <IconContext.Provider value={{ size: "1.25em", className: style.icons }}>
            <ul className={style.topnav}>
                <li className={style.title}>
                    <div title="Otvori projekt (*.cld)" onClick={window.api.openFileDialog}>
                        [ KLIMASOFT PROJEKT (*.cld) ]
                    </div>
                    <div className={style.commands}>
                        <button type="button" title="Novi projekt" onClick={openNewProjectHandler}>
                            <IoAdd />
                        </button>
                        <button type="button" title="Otvori projekt (*.cld)" onClick={window.api.openFileDialog}>
                            <IoFolderOpen />
                        </button>
                        <button type="button" title="Spremi" disabled className={style.primary}>
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