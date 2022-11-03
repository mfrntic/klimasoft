import { IconContext } from "react-icons";
import { IoCheckmark, IoTrash } from 'react-icons/io5';
import style from "./ProjectForm.module.css";
import { getStations } from "../../data/StationsHR";

function ProjectForm() {

    const stations = getStations();

    return (
        <div className={style.projectForm}>
            <form>
                <h2><strong>Projekt</strong>: Obavezni podaci</h2>
                <div className={style.row}>
                    <label>Lokacija / Meteorološka postaja:</label>
                    <select>
                        {stations.map(s => <option key={s.IDStation} value={s.IDStation}>{s.StationName}</option>)}
                    </select>
                </div>
                <div className={style.row}>
                    <label className={style.periodLabel}>Razdoblje motrenja:</label>
                    <small>od</small> <input className={style.year} /> <small>do</small> <input className={style.year} /> <small>god.</small>
                </div>
                <div className={style.row}>
                    <label>Naziv projekta:</label>
                    <input />
                </div>
                <h2>Dodani podaci o projektu</h2>
                <div className={style.row}>
                    <label>Opis projekta:</label>
                    <textarea rows={3}></textarea>
                </div>
            </form>
            <footer>
                <IconContext.Provider value={{ size: "1.1em", className: style.icons }}>
                    <button type="button" className={style.primaryButton}><IoCheckmark /> Potvrdi</button>
                    <button type="button" onClick={window.api.closeNewProject}>Zatvori</button>
                </IconContext.Provider>
            </footer>

        </div>
    )
}

export default ProjectForm;