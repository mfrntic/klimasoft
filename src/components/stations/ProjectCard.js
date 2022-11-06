import style from "./ProjectCard.module.css";
import { IconContext } from "react-icons";
import {FaBookmark, FaMountain,FaMapMarkerAlt, FaTag, FaHistory} from 'react-icons/fa';
 
// const defStat =   {
//     "IDStation": 417,
//     "StationName": "Korenica",
//     "Altitude": 500,
//     "Latitude": 44.74122,
//     "Longitude": 15.719981,
//     "IDStationType": 0,
//     "StationTypeName": "Nepoznata",
//     "IDCountryISO": "HR",
//     "GSN": false
//   };

function ProjectCard({ project }) {
    return (
        <div className={style.card}>
            <IconContext.Provider value={{ size: "1.1em", className: style.icons }}>
                {/* <h2>Opći podaci</h2> */}
                <div className={style.row}>
                    <label title="Naziv odabrane lokacije / postaje"><FaBookmark /></label>
                    <span><strong>{project ? project.StationName : "bilogora"}</strong></span>
                </div>
                <div className={style.row}>
                    <label title="Koordinate (Lat, Lon)"><FaMapMarkerAlt /></label>
                    <span>{project ? project.Latitude: "-"}, {project ? project.Longitude : "-"}</span>
                </div>
                <div className={style.row}>
                    <label title="Nadmorska visina"><FaMountain /></label>
                    <span>{project ? `${project.Altitude} mnv` : "102 mnv"}</span>
                </div>
                <div className={style.row}>
                    <label title="Tip meteorološke postaje"><FaTag /></label>
                    <span>{project ? project.StationTypeName : "-"}</span>
                </div>
                <div className={style.row}>
                    <label title="Razdoblje motrenja"><FaHistory /></label>
                    <span>{project ? project.StationTypeName : "-"}</span>
                </div>
            </IconContext.Provider>
        </div>
    );
}

export default ProjectCard;