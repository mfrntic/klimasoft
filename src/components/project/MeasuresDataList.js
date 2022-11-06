import style from "./MeasuresDataList.module.css";
import { Measures } from "../../data/Measures";
import MeasureDataListItem from "./MeasureDataListItem";

function MeasuresDataList({ selected, onSelect }) {

    return (
        <div className={style.measures}>
            {Measures.map(m => <MeasureDataListItem key={m.IDMeasure}
                measure={m}
                // isOK={m.IDValueType === 1} 
                isSelected={m.IDMeasure === selected?.IDMeasure}
                onSelect={onSelect} />)}
        </div>
    )
}

export default MeasuresDataList;