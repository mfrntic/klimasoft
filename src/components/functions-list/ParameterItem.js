import { useDispatch, useSelector } from "react-redux";
import { Measures } from "../../data/Measures";
import style from "./ParameterItem.module.css";
import { projectActions } from "../../store/projectSlice";

function ParameterItem(props) {
    const { parameter, value } = props.parameter;
    console.log("parameter", parameter);

    const functionName = props.functionName;

    const station = useSelector((a) => a.project.header.station);

    const dispatch = useDispatch();

    function onParameterValueChangedHandler(e) {
        dispatch(
            projectActions.calculationParameter({
                functionName: functionName,
                parameter: parameter,
                value: e.target.value,
            })
        );
    }

    let measures = Measures;
    if (parameter === "oborine") {
        measures = measures.filter((a) => a.GroupName === "Oborine");
    } else if (parameter === "temperatura") {
        measures = measures.filter((a) => a.GroupName === "Temperatura");
    } else if (parameter === "lat") {
        // console.log("station", station);
        measures = [station.Latitude];
    } else if (parameter === "lon") {
        measures = [station.Longitude];
    }

    return (
        <div className={style.parameter}>
            <label>{parameter}</label>
            <select onChange={onParameterValueChangedHandler} value={value}>
                {/* <option></option> */}
                {measures.map((a) => {
                    let id = a.IDMeasure ? a.IDMeasure : a;
                    let text = a.TypeName ? a.TypeName : a;
                    return (
                        <option key={id} value={id}>
                            {text}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}

export default ParameterItem;
