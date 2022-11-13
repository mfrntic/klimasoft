import { useState } from "react";
import { Measures } from "../../data/Measures";
import "./DataBlockToolbar.css";

function DataBlockToolbar({ data, onChange, selectedData }) {

    const [selected, setSelected] = useState();

    function onDataMeasureChangeHandler(e) {
        const measureID = e.target.value;

        let res = {
            [measureID ? measureID : selected]: (measureID ? data : null)
        }
        if (measureID && selected && measureID !== selected) {
            res[selected] = null;
        }

        //console.log("onDataMeasureChange", measureID, data);
        onChange(res);


        setSelected(measureID);
    }

    return <div className={`toolbar ${selected ? 'selected' : null}`}>
        <select value={selected} onChange={onDataMeasureChangeHandler}>
            <option></option>
            {Measures.map(m => <option key={m.IDMeasure}
                value={m.IDMeasure}
                disabled={!!selectedData[m.IDMeasure]}>{m.TypeName}</option>)}
        </select>
    </div>
}

export default DataBlockToolbar;