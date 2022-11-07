
import style from "./StationForm.module.css";

import { StationTypes } from "../../data/StationTypes"
import { v4 as uid } from "uuid";
import { IconContext } from "react-icons";
import { IoSave, IoTrash } from 'react-icons/io5';
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { stationsActions } from "../../store/stationsSlice";

function StationForm({ station, onCancel }) {

    const dispatch = useDispatch();

    // console.log("Station", station);

    const refNaziv = useRef();
    const refLat = useRef();
    const refLon = useRef();
    const refAlt = useRef();
    const refType = useRef();
    const refNotes = useRef();

    useEffect(() => {
        refNaziv.current.focus();
    }, [])

    function isValid() {
        let valid = true;
        if (!refNaziv.current.value) {
            refNaziv.current.classList.add(style.validationError);
            valid = false;
            refNaziv.current.focus();
        }
        if (!refLat.current.value) {
            refLat.current.classList.add(style.validationError);
            if (valid) {
                refLat.current.focus();
            }
            valid = false;
        }
        if (!refLon.current.value) {
            // refLon.current.focus();
            refLon.current.classList.add(style.validationError);
            if (valid) {
                refLon.current.focus();
            }
            valid = false;
        }
        return valid;
    }

    function onSaveHandler() {
        if (!isValid()) {
            // window.alert("Podaci nisu ispravno popunjeni!");

            return;
        }
        const s = {
            "IDStation": !station.IDStation ? uid() : station.IDStation,
            "StationName": refNaziv.current.value,
            "Altitude": refAlt.current.value,
            "Latitude": refLat.current.value,
            "Longitude": refLon.current.value,
            "IDStationType": refType.current.value,
            "StationTypeName": "Nepoznata",
            "Notes": refNotes.current.value,
            isNew: !station.IDStation
        }

        console.log("SAVE", s);
        window.api.saveStation(s);
        dispatch(stationsActions.add(s));
        console.log("SAVE-DISPATCHED");
        onCancel();
    }

    function onDeleteHandler() {
        if (window.confirm("Da li ste sigurni da želite obrisati odabranu lokaciju/postaju?")) {
            window.api.deleteStation(station);
            dispatch(stationsActions.remove(station));
            onCancel();
        }
    }

    function onValidateHandler(e) {
        // if (e.target.classList.contains(style.validationError)){
        if (e.target.value) {
            e.target.classList.remove(style.validationError);
        }
        // }
    }

    return (
        <div className={style.stationForm}>
            <form>
                <h2><strong>Lokacija</strong>: Obavezni podaci</h2>
                <div className={style.row}>
                    <label>Lokacija / Meteorološka postaja: Naziv:</label>
                    <input ref={refNaziv} defaultValue={station.StationName} spellCheck={false} onChange={onValidateHandler} />
                </div>
                <div className={style.row}>
                    <label className={style.labelInline}>Koordinate:</label>
                    <small>Lat:</small> <input ref={refLat} type="number" step="any" min={-45} max={45} className={style.smallInline} defaultValue={station.Latitude} onChange={onValidateHandler} />,
                    <small>Lon:</small> <input ref={refLon} type="number" step="any" min={-180} max={180} className={style.smallInline} defaultValue={station.Longitude} onChange={onValidateHandler} />
                </div>
                <div className={style.row}>
                    <label className={`${style.labelInline} ${style.nmv}`}>Nadmorska visina:</label>
                    <input ref={refAlt} className={style.smallInline} type="number" min={0} max={8000} defaultValue={station.Altitude} /> <small>metara</small>
                </div>
                <h2>Dodani podaci o lokaciji</h2>
                <div className={style.row}>
                    <label className={`${style.labelInline} ${style.nmv}`}>Tip mjerne postaje:</label>
                    <select ref={refType} defaultValue={station.IDStationType}>
                        {StationTypes.map(t => <option key={t.IDStationType} value={t.IDStationType}>{t.StationTypeName}</option>)}
                    </select>
                </div>
                <div className={style.row}>
                    <label>Bilješke:</label>
                    <textarea ref={refNotes} rows={2}>{station.Notes}</textarea>
                </div>
            </form>
            <footer>
                <IconContext.Provider value={{ size: "1.1em", className: style.icons }}>
                    {!!station.IDStation && <button type="button" className={style.deleteButton} title="Obriši lokaciju" onClick={onDeleteHandler}><IoTrash /></button>}
                    <button type="button" className={style.primaryButton} onClick={onSaveHandler}><IoSave /> Spremi</button>
                    <button type="button" onClick={onCancel}>Odustani</button>
                </IconContext.Provider>
            </footer>

        </div>
    );
}

export default StationForm;