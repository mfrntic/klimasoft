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


function ProjectData({ data }) {

    const jRef = useRef(null);
    const [selectedMeasure, setSelectedMeasure] = useState();
    const [currentData, setCurrentData] = useState();


    // const activeProject = window.api.getActiveProject();
    const activeProjectData = useSelector(a => a.project);
    console.log("activeProjectData", activeProjectData);
    const activeProject = Project.fromObject(activeProjectData);
    console.log("isValid", activeProject.header.isValid(), activeProject);

    const dispatch = useDispatch();

    const onGridChange = useCallback(() => {
        setCurrentData(jRef.current.jspreadsheet.getData());
    }, []);

    useEffect(() => {
        console.log("onGridChange", selectedMeasure, currentData);
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
        console.log("selectedMeasure", measure, data);
        initGrid(activeProject.data[measure.IDMeasure]);
        setSelectedMeasure(measure);
        setCurrentData(null);

    }


    return (
        <Layout>
            <div className={style.page}>
                {activeProject?.header.isValid() && <div className={style.data}>
                    <div className={style.measuresMenu}>
                        <div className={style.sticky}>
                            <MeasuresDataList selected={selectedMeasure} onSelect={onSelectedMeasureHandler} />
                            <ProjectCard project={activeProject.header} />
                        </div>
                    </div>
                    <div className={style.measuresData}>
                        <div ref={jRef} className={style.grid} />
                    </div>
                </div>}
                {!activeProject?.header.isValid() && <ProjectNotSelected />}
            </div>
        </Layout>
    )
}

export default ProjectData;