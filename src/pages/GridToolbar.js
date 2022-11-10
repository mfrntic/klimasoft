import style from "./GridToolbar.module.css";

import { IconContext } from "react-icons";
import { FaUndo, FaRedo, FaEraser, FaFileImport } from 'react-icons/fa';
import { MdTabUnselected, MdContentCopy, MdContentPaste } from "react-icons/md";
import { projectActions } from "../store/projectSlice";
import { useDispatch } from "react-redux";

function GridToolbar({ jRef, measure }) {

    const dispatch = useDispatch();

    function onSelectAllHandler() {
        // jRef.current.jspreadsheet.updateSelectionFromCoords(0, 0, data[0].length, data.length)
        jRef.current.jspreadsheet.selectAll();
     
    }

    function onClearDataHandler() {
        if (window.confirm("Da li ste sigurni da želite obrisati sve podatke iz tablice?")) {
            jRef.current.jspreadsheet.setData([[]]);
            const d = {};
            d[measure.IDMeasure] = [];
            // console.log("clear", d);
            dispatch(projectActions.setData(d));
        }
    }

    function onCopyHandler() {
        jRef.current.jspreadsheet.copy(true);
    }

    function onPasteHandler() {

        let selCell = jRef.current.jexcel.selectedCell;
        if (!selCell) {
            selCell = [0, 0];
        }
        navigator.clipboard.readText().then(function (text) {
            if (text) {
                console.log("paste", text);
                jRef.current.jspreadsheet.paste(selCell[0], selCell[1], text);
            }
        });

    }

    return (
        <div className={style.toolbar}>
            <IconContext.Provider value={{ className: style.icons, size: "0.95em" }}>
                <button type="button" title="Poništi" onClick={() => { jRef.current.jspreadsheet.undo() }}><FaUndo /></button>
                <button type="button" title="Ponovi poništeno" onClick={() => { jRef.current.jspreadsheet.redo() }}><FaRedo /></button>
                <button type="button" title="Odaberi sve" onClick={onSelectAllHandler}><MdTabUnselected /></button>
                <button type="button" title="Kopiraj" onClick={onCopyHandler} ><MdContentCopy /></button>
                <button type="button" title="Zalijepi" onClick={onPasteHandler}><MdContentPaste /></button>

                <button type="button" title="Uvoz podataka" className={style.importData}><FaFileImport /></button>
                <button type="button" title="Očisti sadržaj tablice" className={style.clearTable} onClick={onClearDataHandler}><FaEraser /></button>
            </IconContext.Provider>
        </div>
    )
}

export default GridToolbar;