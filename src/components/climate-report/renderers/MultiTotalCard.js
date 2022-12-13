import jspreadsheet from "jspreadsheet-ce";
import { useEffect } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { Measures } from "../../../data/Measures";
import * as klimasoft from "../../../lib/klimatskeformule";
// import { describe } from "../../../lib/mathUtils";
import GridToolbar from "../../project/GridToolbar";
import style from "./MultiValueCard.module.css";
const {describe} = require("../../../lib/mathUtils");
function MultiTotalCard({ calculation }) {

    const data = useSelector(a => a.project.data);

    const jRef = useRef(null);
    console.log("MultiTotalCard", calculation);

    useEffect(() => {
        if (!jRef.current) return;
        if (!jRef.current.jspreadsheet) {

            const options = {
                // data: [...d],
                minDimensions: [12, 1],
                columns: [
                    // { title: ' ', width: 80 },
                    { title: 'sij', width: 80 },
                    { title: 'velj', width: 80 },
                    { title: 'ožu', width: 80 },
                    { title: 'tra', width: 80 },
                    { title: 'svi', width: 80 },
                    { title: 'lip', width: 80 },
                    { title: 'srp', width: 80 },
                    { title: 'kol', width: 80 },
                    { title: 'ruj', width: 80 },
                    { title: 'lis', width: 80 },
                    { title: 'stu', width: 80 },
                    { title: 'pro', width: 80 }, 
                ],
                contextMenu: false,
                editable: false
            };

            jspreadsheet(jRef.current, options);
            jRef.current.jspreadsheet.hideIndex(0);
        }
    }, [])

    useEffect(() => {
        if (data) {
            const finalResult = [];
            const parameters = calculation.parameters.map(p => {
                const measure = Measures.find(a => a.IDMeasure === p.value);
                if (measure) {
                    const r = describe(data[p.value], measure.Aggregation, false)[0];
                    finalResult.push(r);
                    return r;
                }
                else {
                    return p.value;
                }
            });
            const func = klimasoft[calculation.name].calculate;
            const res = func(...parameters);


            if (Array.isArray(res.result) && Array.isArray(res.value)) {

                finalResult.push([...res.value], [...res.result]);
                jRef.current.jspreadsheet.setData(finalResult);
            }
            else {
                jRef.current.jspreadsheet.setData([[...res.result, res.value]]);
            }
        }
    }, [calculation.name, calculation.parameters, data])


    return (
        <div>
            <h3>{calculation.title}</h3>
            <div ref={jRef} className={style.gridtotal}>
                <GridToolbar jRef={jRef} />
            </div>
        </div>

    )



}

export default MultiTotalCard;