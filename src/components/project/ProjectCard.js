import style from "./ProjectCard.module.css";
import { IconContext } from "react-icons";
import { FaBookmark, FaMountain, FaMapMarkerAlt, FaTag, FaHistory } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';
import { ProjectHeader } from "../../models/klimasoft-project";


function ProjectCard({ project }) {
    const header = new ProjectHeader(project);
    const station = header.station;

    function openProjectDialogHandler() {
        window.api.openNewProject(true);
    }

    return (
        <div className={style.card}>
            <IconContext.Provider value={{ size: "1.1em", className: style.icons }}>
                <h2>
                    {header.projectName}
                    <button type="button" title="Postavke projekta" onClick={openProjectDialogHandler}>
                        <IoSettings size="1.3em" />
                    </button>
                </h2>
                <div className={style.row}>
                    <label title="Naziv odabrane lokacije / postaje"><FaBookmark /></label>
                    <span><strong>{station.StationName}</strong></span>
                </div>
                <div className={style.row}>
                    <label title="Koordinate (Lat, Lon)"><FaMapMarkerAlt /></label>
                    <span>{station.Latitude}, {station.Longitude}</span>
                </div>
                <div className={style.row}>
                    <label title="Nadmorska visina"><FaMountain /></label>
                    <span>{station.Altitude} mnv</span>
                </div>
                <div className={style.row}>
                    <label title="Tip meteorološke postaje"><FaTag /></label>
                    <span>{station.StationTypeName}</span>
                </div>
                <div className={style.row}>
                    <label title="Razdoblje motrenja"><FaHistory /></label>
                    <span>{header.period.from}. - {header.period.to}. ({header.period.getYears()})</span>
                </div>
            </IconContext.Provider>
        </div>
    );
}

export default ProjectCard;