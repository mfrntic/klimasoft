import style from "./MeasuresDataList.module.css";
import { Measures } from "../../data/Measures";
import MeasureDataListItem from "./MeasureDataListItem";
import { useSelector } from "react-redux";
import { ProjectData } from "../../models/klimasoft-project";

function MeasuresDataList({ selected, onSelect }) {

    const data = useSelector(a => a.project.data);
    const projectData = new ProjectData(data);

    // console.log("hasData", selected, projectData.hasData(selected?.IDMeasure));

    return (
        <div className={style.measures}>
            {Measures.map(m => <MeasureDataListItem key={m.IDMeasure}
                measure={m}
                hasData={projectData.hasData(m.IDMeasure)}
                isSelected={m.IDMeasure ===   selected?.IDMeasure }
                onSelect={onSelect} />)}
        </div>
    )
}

export default MeasuresDataList;