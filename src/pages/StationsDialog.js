import style from "./StationsDialog.module.css";
import { IconContext } from "react-icons";
import { IoSearch, IoAdd } from 'react-icons/io5';
import StationListItem from "../components/stations-form/StationListItem";
import { useEffect, useRef, useState } from "react";
import StationForm from "../components/stations-form/StationForm";
import { useDispatch, useSelector } from "react-redux";
import { stationsActions } from "../store/stationsSlice";
import { useDebounce } from "../hooks/useDebounce";

function StationsDialog() {

    const [selectedItem, setSelectedItem] = useState();
    const [searchTerm, setSearchTerm] = useState();
    const term = useSelector(a => a.stations.searchTerm);
    const debounced = useDebounce(searchTerm, 300);
    const refSearch = useRef();

    const stations = useSelector(state => state.stations.items);
 

    const dispatch = useDispatch();

    useEffect(() => {
        if (!selectedItem) {
            refSearch.current.focus();       
        }
    }, [selectedItem]);

 
    useEffect(() => {
        if (debounced !== undefined) {
            dispatch(stationsActions.search(debounced));
        }

    }, [debounced, dispatch]);

    function closeHandler() {
        window.api.closeStations();
    }

    function onSelectedItemHandler(item) {
        setSelectedItem(item);
    }

    function onCancelHandler() {
        setSelectedItem(null);
    }

    function onAddStationHandler() {
        //nova lokacija / postaja
        setSelectedItem({
            "IDStation": 0,
            "StationName": "",
            "Altitude": null,
            "Latitude": null,
            "Longitude": null,
            "IDStationType": 0,
            "StationTypeName": "Nepoznata",
            "IDCountryISO": "HR",
            "GSN": false
        });
    }

    function onSearchHandler(e) {
        const val = e.target.value;
        setSearchTerm(val);
        // dispatch(stationsActions.search(val));
    }

    return (
        !selectedItem ? <div className={style.stations}>
            <div className={style.search}>
                <IconContext.Provider value={{ className: style.icon, size: "1.25em" }}>
                    <IoSearch />
                </IconContext.Provider>
                <input ref={refSearch} placeholder="Pretraživanje lokacija..." onChange={onSearchHandler} defaultValue={term} />
            </div>
            <div className={style.list}>
                {stations.length > 0 && stations.map(station => <StationListItem key={station.IDStation}
                    station={station} onSelected={onSelectedItemHandler} />)} 
                {(!stations || stations.length === 0) && <div className={style.center}>popis je prazan...</div>}
            </div>

            <footer>
                <IconContext.Provider value={{ className: style.icon, color: "white", size: "1.25em" }}>
                    <button type="button" className={style.buttonAdd} title="Dodaj lokaciju" onClick={onAddStationHandler}><IoAdd /></button>
                    <button type="button" onClick={closeHandler}>Zatvori</button>
                </IconContext.Provider>
            </footer>
        </div> :
            <StationForm station={selectedItem} onCancel={onCancelHandler} />
    )
}

export default StationsDialog;