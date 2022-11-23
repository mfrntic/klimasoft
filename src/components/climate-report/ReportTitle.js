import { useSelector } from "react-redux";
import style from "./ReportTitle.module.css";

function ReportTitle(){
    const header = useSelector(a=>a.project.header);
    return <h1 className={style.title}>{header.projectName} <small className={style.stationBadge}>{header.station.StationName}, Lon:{header.station.Latitude}; Lat:{header.station.Longitude}; Alt: {header.station.Altitude}</small></h1>
}

export default ReportTitle;