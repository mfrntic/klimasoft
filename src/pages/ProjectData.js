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

import { Measures } from "../data/Measures";
import GridToolbar from "./GridToolbar";


function ProjectData() {

    // const activeProject = window.api.getActiveProject();
    const activeProjectData = useSelector(a => a.project);
    const activeProject = Project.fromObject(activeProjectData);
    console.log("activeProject", activeProject);

    const jRef = useRef(null);
    const [selectedMeasure, setSelectedMeasure] = useState(Measures[0]);

    const dispatch = useDispatch();




    useEffect(() => {
        if (activeProject && selectedMeasure) {

            const data = activeProject.data[selectedMeasure.IDMeasure];

            const onGridChange = () => {
                const d = {};
                d[selectedMeasure.IDMeasure] = jRef.current.jspreadsheet.getData();
                dispatch(projectActions.setData(d));
                console.log("change", d);
            };

            if (!jRef.current) return;
            // if (jRef.current.jspreadsheet) {
            //     jRef.current.jspreadsheet.destroy();
            // }
            const d = data.map(a => [...a]); //for deep copy, req. by jspreadsheet
            if (!jRef.current.jspreadsheet) {
                const options = {
                    // data: [...d],
                    minDimensions: [13, 1],
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
                    minSpareRows: 1
                };

                jspreadsheet(jRef.current, options);
                jRef.current.jspreadsheet.hideIndex(0);

            }
            // console.log("jref", jRef.current.jspreadsheet);
            jRef.current.jspreadsheet.onafterchanges = onGridChange;
            jRef.current.jspreadsheet.setData([...d]);


        }

    }, [activeProject, dispatch, selectedMeasure]);

    function onSelectedMeasureHandler(measure) {
        console.log("selectedMeasure", measure);
        setSelectedMeasure(measure);

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
                        <div ref={jRef} className={style.grid}>
                            <GridToolbar jRef={jRef} measure={selectedMeasure} />
                        </div>
                        {selectedMeasure && <small>* Podatke unosite kao niz godišnjih prosjeka (svaka godina je jedan red, prva kolona sadrži godinu) ili samo kao izračunati višegodišnji prosjek (jedan red ukupno, prva kolona sadrži bilo što, npr tekst "Ukupno")</small>}
                    </div>
                </div>}
                {!activeProject?.header.isValid() && <ProjectNotSelected />}
            </div>
        </Layout>
    )
}

export default ProjectData;