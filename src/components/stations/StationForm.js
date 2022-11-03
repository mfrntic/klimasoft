import { useNavigate, useParams } from "react-router-dom";
import style from "./StationForm.module.css";
import { StationsHR } from "../../data/StationsHR";
import { StationTypes } from "../../data/StationTypes"

import { IconContext } from "react-icons";
import { IoSave, IoTrash } from 'react-icons/io5';


function StationForm() {
    const params = useParams();
    const navigate = useNavigate();

    const station = StationsHR.find(a => a.IDStation == params.id);
    console.log("route params", params, station);

    function onCancelHandler() {
        navigate("/stations");
    }

    return (
        <div className={style.stationForm}>
            <form>
                <h2><strong>Lokacija</strong>: Obavezni podaci</h2>
                <div className={style.row}>
                    <label>Lokacija / Meteorološka postaja: Naziv:</label>
                    <input defaultValue={station.StationName} />
                </div>
                <div className={style.row}>
                    <label className={style.labelInline}>Koordinate:</label>
                    <small>Lat:</small> <input className={style.smallInline} value={station.Latitude} />,
                    <small>Lon:</small> <input className={style.smallInline} value={station.Longitude} />
                </div>
                <div className={style.row}>
                    <label className={`${style.labelInline} ${style.nmv}`}>Nadmorska visina:</label>
                    <input className={style.smallInline} type="number" value={station.Altitude} /> <small>metara</small>
                </div>
                <h2>Dodani podaci o lokaciji</h2>
                <div className={style.row}>
                    <label className={`${style.labelInline} ${style.nmv}`}>Tip mjerne postaje:</label>
                    <select defaultValue={station.IDStationType}>
                        {StationTypes.map(t => <option key={t.IDStationType} value={t.IDStationType}>{t.StationTypeName}</option>)}
                    </select>
                </div>
                <div className={style.row}>
                    <label>Bilješke:</label>
                    <textarea rows={2}></textarea>
                </div>
            </form>
            <footer>
                <IconContext.Provider value={{ size: "1.1em", className: style.icons }}>

                    <button type="button" className={style.deleteButton} title="Obriši lokaciju"><IoTrash /></button>
                    <button type="button" className={style.primaryButton}><IoSave /> Spremi</button>
                    <button type="button" onClick={onCancelHandler}>Odustani</button>
                </IconContext.Provider>
            </footer>

        </div>
    );
}

export default StationForm;