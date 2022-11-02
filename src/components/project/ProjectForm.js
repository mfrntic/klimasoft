import style from "./ProjectForm.module.css";

function ProjectForm() {
    return (
        <div className={style.projectForm}>
            <form>
                <h2>Osnovni obavezni podaci</h2>
                <div className={style.row}>
                    <label>Lokacija / Meteorološka postaja:</label>
                    <select></select>
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
                    <textarea rows={5}></textarea>
                </div>
            </form>
            <footer>
                <button type="button" onClick={window.api.closeNewProject}>Zatvori</button>
            </footer>

        </div>
    )
}

export default ProjectForm;