
import { IconContext } from "react-icons";
import { IoBarChart, IoApps, IoFolderOpen, IoAdd, IoSettings } from 'react-icons/io5';
import { NavLink } from "react-router-dom";
import style from "./ProjectMenu.module.css";

function ProjectMenu(props) {

    return (
        <IconContext.Provider value={{ size: "1.25em", className: style.icons }}>
            <ul className={style.topnav}>
                <li className={style.title}>
                    <div title="Otvori projekt (*.cld)" onClick={window.api.openFileDialog}>
                        [ ODABERITE PROJEKT (*.cld) ]
                    </div>
                    <div className={style.commands}>
                        <button type="button" title="Novi projekt" onClick={window.api.openNewProject}>
                            <IoAdd />
                        </button>
                        <button type="button" title="Otvori projekt (*.cld)" onClick={window.api.openFileDialog}>
                            <IoFolderOpen />
                        </button>
                        <button type="button" title="Postavke projekta" disabled>
                            <IoSettings />
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