import { Fragment, useRef, useState } from "react";
import { IconContext } from "react-icons";
import { IoCheckmark, IoTrash, IoLocation } from 'react-icons/io5';
import { useSelector } from "react-redux";
import Select from 'react-select';
import style from "./ProjectForm.module.css";

function ProjectForm() {

    const [selectedLokacija, setSelectedLokacija] = useState();
    const [hasError, setHasError] = useState(false);

    const stations = useSelector(state => state.stations.items);

    const refPeriodOd = useRef();
    const refPeriodDo = useRef();
    const refNaziv = useRef();
    const refNotes = useRef();

    function isValid() {
        let valid = true;
        if (!selectedLokacija) {
            // refLokacija.current.props.className = style.error;
            setHasError(true);
            valid = false;
        }
        else {
            setHasError(false);
        }
        if (!refPeriodOd.current.value) {
            refPeriodOd.current.classList.add(style.error);
            if (valid) {
                refPeriodOd.current.focus();
            }
            valid = false;
        }
        if (!refPeriodDo.current.value) {
            refPeriodDo.current.classList.add(style.error);
            if (valid) {
                refPeriodDo.current.focus();
            }
            valid = false;
        }
        if (!refNaziv.current.value) {
            refNaziv.current.classList.add(style.error);
            if (valid) {
                refNaziv.current.focus();
            }
            valid = false;
        }
        return valid;
    }

    function onConfirmHandler() {
        if (isValid()) {
            console.log("Spremanje...");
            //close
            window.api.closeNewProject();
        }

    }


    function onValidateHandler(e) {
        setSelectedLokacija(e);
        if (e && !e.target) {
            setHasError(false);
        }

        if (e.target && e.target.value) {

            if (e.target.classList) {
                e.target.classList.remove(style.error);
            }
        }
    }

    return (
        <div className={style.projectForm}>
            <IconContext.Provider value={{ size: "1.1em", className: style.icons }}>

                <form>
                    <h2><strong>Projekt</strong>: Obavezni podaci</h2>
                    <div className={style.row}>
                        <label>Lokacija / Meteorološka postaja:</label>
                        <Select styles={{
                            valueContainer: (provided, state) => (hasError ? {
                                backgroundColor: "#ffe6e6 !important",
                                ...provided
                            } : provided),
                            container: (provided) => (hasError ? {
                                border: "1px tomato solid !important",
                                borderRadius: "4px",
                                ...provided
                            } : provided)
                        }}
                            placeholder=""
                            getOptionValue={(v) => v.text}
                            // defaultValue={selectedLokacija}
                            onChange={onValidateHandler}
                            options={stations.map(s => {
                                return {
                                    value: s.IDStation,
                                    text: s.StationName + " " + s.StationTypeName,
                                    label: <Fragment>{s.StationName} <span className={style.stationtype}>{s.StationTypeName}</span><small className={style.coordinates}><IoLocation /> {s.Latitude}, {s.Longitude}</small></Fragment>
                                }
                            })} />
                    </div>
                    <div className={style.row}>
                        <label className={style.periodLabel}>Razdoblje motrenja:</label>
                        <small>od</small> <input ref={refPeriodOd} type="number" className={style.year} onChange={onValidateHandler} min={"1900"} max={"2050"} />
                        <small>do</small> <input ref={refPeriodDo} type="number" className={style.year} onChange={onValidateHandler} min={"1900"} max={"2050"} /> <small>god.</small>
                    </div>
                    <div className={style.row}>
                        <label>Naziv projekta:</label>
                        <input ref={refNaziv} onChange={onValidateHandler} />
                    </div>
                    <h2>Dodani podaci o projektu</h2>
                    <div className={style.row}>
                        <label>Opis projekta:</label>
                        <textarea ref={refNotes} rows={3}></textarea>
                    </div>
                </form>
                <footer>
                    <button type="button" className={style.primaryButton} onClick={onConfirmHandler}><IoCheckmark /> Potvrdi</button>
                    <button type="button" onClick={window.api.closeNewProject}>Zatvori</button>

                </footer>
            </IconContext.Provider>
        </div>
    )
}

export default ProjectForm;