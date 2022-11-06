import { Fragment, useRef, useState } from "react";
import { IconContext } from "react-icons";
import { IoCheckmark, IoTrash, IoLocation } from 'react-icons/io5';
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import style from "./ProjectForm.module.css";
import { projectActions } from "../../store/projectSlice";

function ProjectForm() {


    const data = useSelector(a => a.project.header);
    const dispatch = useDispatch();

    const [selectedLokacija, setSelectedLokacija] = useState(data.station);
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
            const header = {
                projectName: refNaziv.current.value,
                period: {
                    from: refPeriodOd.current.value,
                    to: refPeriodDo.current.value
                },
                station: selectedLokacija,
                description: refNotes.current.value
            }
            console.log("header", header);
            dispatch(projectActions.setHeader(header));
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
                            defaultValue={selectedLokacija}
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
                        <small>od</small> <input ref={refPeriodOd} type="number" defaultValue={data.period.from} className={style.year} onChange={onValidateHandler} min={"1900"} max={"2050"} />
                        <small>do</small> <input ref={refPeriodDo} type="number" defaultValue={data.period.to} className={style.year} onChange={onValidateHandler} min={"1900"} max={"2050"} /> <small>god.</small>
                    </div>
                    <div className={style.row}>
                        <label>Naziv projekta:</label>
                        <input ref={refNaziv} defaultValue={data.projectName} onChange={onValidateHandler} />
                    </div>
                    <h2>Dodani podaci o projektu</h2>
                    <div className={style.row}>
                        <label>Opis projekta:</label>
                        <textarea ref={refNotes} rows={3}>{data.description}</textarea>
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