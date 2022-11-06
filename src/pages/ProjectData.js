import Layout from "../components/layout/Layout";
import ProjectNotSelected from "../components/project/ProjectNotSelected";
import style from "./ProjectData.module.css";

import jspreadsheet from "jspreadsheet-ce";
import "jspreadsheet-ce/dist/jspreadsheet.css";
// import "jspreadsheet-ce/dist/jspreadsheet.theme.css";

import { useCallback, useEffect, useRef, useState } from "react";
import MeasuresDataList from "../components/project/MeasuresDataList";
import StationCard from "../components/stations/ProjectCard";
import { useDispatch, useSelector } from "react-redux";
import { projectActions } from "../store/projectSlice";


function ProjectData() {

    const jRef = useRef(null);
    const [selectedMeasure, setSelectedMeasure] = useState();
    const [currentData, setCurrentData] = useState();

    const data = useSelector(a => a.project.data);
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

    function initGrid() {
        if (!jRef.current.jspreadsheet) {
            const options = {
                data: [],
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
    }

    function onSelectedMeasureHandler(measure) {
        console.log("selectedMeasure", measure, data);
        initGrid();
        setSelectedMeasure(measure);
        if (data[measure.IDMeasure].length > 0) {
            jRef.current.jspreadsheet.setData(data[measure.IDMeasure]);
        }
        else {
            jRef.current.jspreadsheet.setData([[]]);
            setCurrentData(null);
        }
    }

    return (
        <Layout>
            <div className={style.page}>
                <div className={style.data}>
                    <div className={style.measuresMenu}>
                        <MeasuresDataList selected={selectedMeasure} onSelect={onSelectedMeasureHandler} />
                        <StationCard />
                    </div>
                    <div className={style.measuresData}>
                        <div ref={jRef} className={style.grid} />
                    </div>
                </div>
                {/* <ProjectNotSelected /> */}
            </div>
        </Layout>
    )
}

export default ProjectData;