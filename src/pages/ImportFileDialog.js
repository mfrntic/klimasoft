import { useCallback, useState } from "react";
import style from "./ImportFileDialog.module.css";
import ImportPreview from "../components/text-import/ImportPreview";
import { IconContext } from "react-icons";
import { FaFileImport } from "react-icons/fa";

function isEmpty(obj) {
    for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function ImportFileDialog() {

    const [txt, setTxt] = useState();
    const [data4Import, setData4Import] = useState();

    window.api.importDialogHandler((e, txt) => {
        setTxt(txt);
    });

    const onDataChangeHandler = useCallback(function (data) {
        console.log("onDataChangeHandler", data);
        setData4Import({ ...data });
    }, [])




    return (
        <section className={style.import}>
            <div className={style.body}>
                <ImportPreview contents={txt} onDataChange={onDataChangeHandler} />
            </div>
            <footer>
                <IconContext.Provider value={{ size: "1.1em", className: style.icons }}>
                    <button type="button" className={style.primaryButton} disabled={isEmpty(data4Import)}><FaFileImport /> Uvezi podatke</button>
                    <button type="button" onClick={() => { window.api.importFileDialogClose() }}>Zatvori</button>
                </IconContext.Provider>
            </footer>
        </section>
    );
}

export default ImportFileDialog;