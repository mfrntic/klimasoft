import { getStations } from "../data/StationsHR";
import style from "./StationsDialog.module.css";
import { IconContext } from "react-icons";
import { IoSearch, IoAdd } from 'react-icons/io5';
import StationListItem from "../components/stations/StationListItem";
import { useState } from "react";
import StationForm from "../components/stations/StationForm";

function StationsDialog() {

    const [selectedItem, setSelectedItem] = useState();

    function closeHandler() {
        window.api.closeStations();
    }

    function onSelectedItemHandler(item) {
        setSelectedItem(item);
    }

    function onCancelHandler() {
        setSelectedItem(null);
    }

    return (
        !selectedItem ? <div className={style.stations}>
            <div className={style.search}>
                <IconContext.Provider value={{ className: style.icon, size: "1.25em" }}>
                    <IoSearch />
                </IconContext.Provider>
                <input placeholder="Pretraživanje lokacija..." />
            </div>
            <div className={style.list}>
                {getStations().map(station => <StationListItem key={station.IDStation}
                    station={station} onSelect={onSelectedItemHandler} />)}
            </div>
            <footer>
                <IconContext.Provider value={{ className: style.icon, color: "white", size: "1.25em" }}>
                    <button type="button" className={style.buttonAdd} title="Dodaj lokaciju"><IoAdd /></button>
                    <button type="button" onClick={closeHandler}>Zatvori</button>
                </IconContext.Provider>
            </footer>
        </div> :
            <StationForm station={selectedItem} onCancel={onCancelHandler} />
    )
}

export default StationsDialog;