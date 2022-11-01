import { StationsHR } from "../data/StationsHR";
import style from "./Stations.module.css";
import { IconContext } from "react-icons";
import { IoSearch, IoAdd } from 'react-icons/io5';
import StationListItem from "../components/stations/StationListItem";

function Stations() {

    function closeHandler() {
        console.log(window);
        window.api.closeStations();
    }

    return <div className={style.stations}>
        <div className={style.search}>
            <IconContext.Provider value={{ className: style.icon, size: "1.25em" }}>
                <IoSearch />
            </IconContext.Provider>
            <input placeholder="Pretraživanje lokacija..." />
        </div>
        <div className={style.list}>
            {StationsHR.map(station => <StationListItem key={station.IDStation} station={station} />)}
        </div>
        <footer>
            <IconContext.Provider value={{ className: style.icon,  color: "white", size: "1.25em" }}>
                <button type="button" className={style.buttonAdd} title="Dodaj lokaciju"><IoAdd /></button>
                <button type="button" onClick={closeHandler}>Zatvori</button>
            </IconContext.Provider>
        </footer>
    </div>
}

export default Stations;