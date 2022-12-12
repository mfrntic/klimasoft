import jspreadsheet from "jspreadsheet-ce";
import { useEffect } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { Measures } from "../../../data/Measures";
import * as klimasoft from "../../../lib/klimatskeformule";
// import { describe } from "../../../lib/mathUtils";
import GridToolbar from "../../project/GridToolbar";
import style from "./MultiValueCard.module.css";
// const {describe} = require("../../../lib/mathUtils");
function MultiValueCard({ calculation }) {

    const data = useSelector(a => a.project.data);
    const jRef = useRef(null);


    useEffect(() => {
        if (!jRef.current) return;
        if (!jRef.current.jspreadsheet) {

            let cols = [
                // { title: ' ', width: 80 },
                { title: 'Godina', width: 80 },
                { title: 'Oborine', width: 80 },
                { title: 'Anomaly', width: 80 },
                { title: 'RAI', width: 80 },
            ];
            if (calculation.name === "percentOfNormalPercipitation") {
                cols = [
                    // { title: ' ', width: 80 },
                    { title: 'Godina', width: 106 },
                    { title: 'Oborine', width: 106 },
                    { title: 'PN', width: 106 },
                ]
            }
            else if (calculation.name === "drySeasonDuration"){
                cols = [
                    // { title: ' ', width: 80 },
                    { title: 'Godina', width: 106 },
                    { title: 'Mjeseci', width: 106 },
                    { title: 'LDS', width: 106 }, 
                ]
            }

            const options = {
                // data: [...d],
                // minDimensions: [3, 1],
                columns: cols,
                contextMenu: false,
                editable: false
            };

            jspreadsheet(jRef.current, options);
            jRef.current.jspreadsheet.hideIndex(0);
        }
    }, [calculation.name])

    useEffect(() => {
        if (data) {
            console.log("MultiValueCard", data,calculation.parameters);
            // const finalResult = [];
            const parameters = calculation.parameters.map(p => {
                const measure = Measures.find(a => a.IDMeasure === p.value);
                if (measure) {
                    // const r = describe(data[p.value], measure.Aggregation, false)[0];
                    // finalResult.push(r);
                    // return r;
                    // finalResult.push(data[p.value]);
                    return data[p.value];
                }
                else {
                    return p.value;
                }
            });
            const func = klimasoft[calculation.name].calculate;
            const res = func(...parameters);

            console.log("final", parameters, res.result);

            // if (Array.isArray(res.result) && Array.isArray(res.value)) {


            jRef.current.jspreadsheet.setData(res.result);
            // }
            // else {
            //     jRef.current.jspreadsheet.setData([[...res.result, res.value]]);
            // }
        }
    }, [calculation.name, calculation.parameters, data])


    return (
        <div>
            <h3>{calculation.title}</h3>
            <p className={style.description}>{klimasoft[calculation.name].description}</p>
            <div ref={jRef} className={style.gridtotal}>
                <GridToolbar jRef={jRef} />
            </div>
       
        </div>

    )



}

export default MultiValueCard;