import Layout from "../components/layout/Layout";
import ProjectNotSelected from "../components/project/ProjectNotSelected";
import style from "./ProjectData.module.css";

import jspreadsheet from "jspreadsheet-ce";
import "jspreadsheet-ce/dist/jspreadsheet.css";
// import "jspreadsheet-ce/dist/jspreadsheet.theme.css";

import { useCallback, useEffect, useRef, useState } from "react";
import MeasuresDataList from "../components/measures-data-list/MeasuresDataList";
import ProjectCard from "../components/project/ProjectCard";
import { useDispatch, useSelector } from "react-redux";
import { projectActions } from "../store/projectSlice";
import Project from "../models/klimasoft-project";

import { IconContext } from "react-icons";
import { FaUndo, FaRedo, FaEraser, FaFileImport } from 'react-icons/fa';


function ProjectData({ data }) {

    const jRef = useRef(null);
    const [selectedMeasure, setSelectedMeasure] = useState();
    const [currentData, setCurrentData] = useState();


    // const activeProject = window.api.getActiveProject();
    const activeProjectData = useSelector(a => a.project);
    //console.log("activeProjectData", activeProjectData);
    const activeProject = Project.fromObject(activeProjectData);
    // console.log("isValid", activeProject.header.isValid(), activeProject);

    const dispatch = useDispatch();

    const onGridChange = useCallback(() => {
        setCurrentData(jRef.current.jspreadsheet.getData());
    }, []);

    useEffect(() => {
        // console.log("onGridChange", selectedMeasure, currentData);
        if (selectedMeasure && currentData) {
            const d = {};
            d[selectedMeasure.IDMeasure] = currentData;
            // console.log("data2dispatch", d);
            dispatch(projectActions.setData(d));
        }
    }, [selectedMeasure, currentData, dispatch])

    function initGrid(data) {
        if (jRef.current.jspreadsheet) {
            jRef.current.jspreadsheet.destroy();
        }
        const d = data.map(a => [...a]); //for deep copy, req. by jspreadsheet
        const options = {
            data: [...d],
            minDimensions: [13, 2],
            columns: [
                { title: ' ' },
                { title: 'sij' },
                { title: 'velj' },
                { title: 'ožu' },
                { title: 'tra' },
                { title: 'svi' },
                { title: 'lip' },
                { title: 'srp' },
                { title: 'kol' },
                { title: 'ruj' },
                { title: 'lis' },
                { title: 'stu' },
                { title: 'pro' },
            ],
            contextMenu: false,
            onafterchanges: onGridChange
        };


        jspreadsheet(jRef.current, options);
        jRef.current.jspreadsheet.hideIndex(0);

    }

    function onSelectedMeasureHandler(measure) {
        // console.log("selectedMeasure", measure, data);
        initGrid(activeProject.data[measure.IDMeasure]);
        setSelectedMeasure(measure);
        setCurrentData(null);

    }

    function onClearDataHandler() {
        if (window.confirm("Da li ste sigurni da želite obrisati sve podatke iz tablice?")) {
            jRef.current.jspreadsheet.setData([]);
        }
    }


    return (
        <Layout>
            <div className={`${style.page} ${activeProject?.header.isValid() ? null : style.fullHeight}`}>
                {activeProject?.header.isValid() && <div className={style.data}>
                    <div className={style.measuresMenu}>
                        <div className={style.sticky}>
                            <MeasuresDataList selected={selectedMeasure} onSelect={onSelectedMeasureHandler} />
                            <ProjectCard project={activeProject.header} />
                        </div>
                    </div>
                    <div className={style.measuresData}>
                        {selectedMeasure && <h4>UNOS PODATAKA*: <span className={style.titleMeasure}>{selectedMeasure.TypeName}</span></h4>}
                        {selectedMeasure && <div className={style.toolbar}>
                            <IconContext.Provider value={{ className: style.icons, size: "0.95em" }}>
                                <button type="button" title="Poništi" onClick={() => { jRef.current.jspreadsheet.undo() }}><FaUndo /></button>
                                <button type="button" title="Ponovi poništeno" onClick={() => { jRef.current.jspreadsheet.redo() }}><FaRedo /></button>
                                <button type="button" title="Uvoz podataka" className={style.importData}><FaFileImport /></button>
                                <button type="button" title="Očisti sadržaj tablice" className={style.clearTable} onClick={onClearDataHandler}><FaEraser /></button>
                            </IconContext.Provider>
                        </div>}
                        <div ref={jRef} className={style.grid} />
                        {selectedMeasure && <small>* Podatke unosite kao niz godišnjih prosjeka (svaka godina je jedan red, prva kolona sadrži godinu) ili samo kao izračunati višegodišnji prosjek (jedan red ukupno, prva kolona sadrži bilo što, npr tekst "Ukupno")</small>}
                    </div>
                </div>}
                {!activeProject?.header.isValid() && <ProjectNotSelected />}
            </div>
        </Layout>
    )
}

export default ProjectData;