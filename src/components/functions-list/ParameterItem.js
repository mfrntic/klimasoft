import { Measures } from "../../data/Measures";
import style from "./ParameterItem.module.css";

function ParameterItem({ parameter }) {

    let measures = Measures;
    if (parameter === "oborine") {
        measures = measures.filter(a => a.GroupName === "Oborine");
    }
    else if (parameter === "temperatura") {
        measures = measures.filter(a => a.GroupName === "Temperatura");
    }
    else {
        measures = [];
    }


    return (
        <form className={style.parameter}>
            <label>{parameter}</label>
            <select>
                {measures.map(a => <option value={a.IDMeasure}>{a.TypeName}</option>)}
            </select>
        </form>
    );
}

export default ParameterItem;