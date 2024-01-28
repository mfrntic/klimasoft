import { useDispatch, useSelector } from "react-redux";
import { Measures } from "../../data/Measures";
import style from "./ParameterItem.module.css";
import { projectActions } from "../../store/projectSlice";

function ParameterItem(props) {
    let { parameter, value } = props.parameter;
    // console.log("parameter", parameter);

    const functionName = props.functionName;

    const station = useSelector((a) => a.project.header.station);
    const data = useSelector(a => a.project.data);
    // console.log("DATA", data);

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
    }
    else if (parameter === "temperatura") {
        measures = measures.filter((a) => a.GroupName === "Temperatura");
    }
    else if (parameter === "lat") {
        // console.log("station", station);
        measures = [station.Latitude];
    }
    else if (parameter === "lon") {
        measures = [station.Longitude];
    }
    else if (parameter.startsWith("show")) {
        measures = ["true", "false"];
    }
    else if (parameter === "years_in_row") {
        measures = [3, 4, 5, 6, 7, 8, 9, 10];
    }
    else if (parameter === "vegetation_temp_treshold") {
        measures = [6, 6.5, 7];
    }
    else if (parameter.startsWith("reference")) {

        const godine = data.percipitation.map(arr => Number(arr[0])).filter(a => a > 0);
        const unique = [...new Set(godine)];
        unique.sort();
        console.log(unique);
        measures = [...unique]
    }

    
    if (value === 0) {
        dispatch(
            projectActions.calculationParameter({
                functionName: functionName,
                parameter: parameter,
                value: measures[0],
            })
        );
    }

    if (value === -1) {
        dispatch(
            projectActions.calculationParameter({
                functionName: functionName,
                parameter: parameter,
                value: measures[measures.length - 5 > 0 ? measures.length - 5 : measures[0]],
            })
        );
    }

    return (
        <div className={style.parameter}>
            <label title={parameter}>{parameter}</label>
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
