import { StationsHR } from "../data/StationsHR";
import style from "./Stations.module.css";
function Stations() {
    return <div className={style.stations}>
        {StationsHR.map(station => <div>{station.StationName} - {station.StationTypeName} - {station.Latitude}, {station.Longitude}</div>)}
    </div>
}

export default Stations;