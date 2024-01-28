import jspreadsheet from "jspreadsheet-ce";
import { useEffect, useState } from "react";
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
    const station = useSelector(a => a.project.header.station);

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
                    { title: 'Godina', width: 80 },
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
                    { title: 'Oborine uk.', width: 80 },
                    { title: 'PN god.', width: 80 },
                ]
            }
            else if (calculation.name === "drySeasonDuration") {
                cols = [
                    // { title: ' ', width: 80 },
                    { title: 'Godina', width: 106 },
                    { title: 'Mjeseci', width: 106 },
                    { title: 'LDS', width: 106 },
                ]
            }
            else if (calculation.name === "drySeasonWaterDeficit" ||
                calculation.name === "thornthwaiteWaterBalance" ||
                calculation.name === "thornthwaitePET"
            //    ||  calculation.name === "rainfallAnomalyIndex"
                ) {
                cols = [
                    { title: ' ', width: 80 },
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
                ]
            }
            else if (  calculation.name === "rainfallAnomalyIndex"
            ) {
            cols = [
                { title: 'Godina', width: 80 },
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
                { title: 'Oborine uk.', width: 80 },
                { title: 'Anomaly', width: 80 },
                { title: 'RAI god.', width: 80 },
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
            // console.log("MultiValueCard", data,calculation.parameters);
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
                else if (p.parameter === "lat") {
                    return station.Latitude;
                }
                else if (p.parameter === "lon") {
                    return station.Longitude;
                }
                else {
                    return p.value
                }
            });
            const func = klimasoft[calculation.name].calculate;

            const res = func(...parameters);

            jRef.current.jspreadsheet.setData(res.result);

            // if (Array.isArray(res.result) && Array.isArray(res.value)) {

            // }
            // else {
            //     jRef.current.jspreadsheet.setData([[...res.result, res.value]]);
            // }
        }
    }, [calculation.name, calculation.parameters, data, station.Latitude, station.Longitude])

    return (
            <div>
                <h3>{calculation.title}</h3>
                <p className={style.description}>{klimasoft[calculation.name].description}</p>
                <div ref={jRef} className={style.gridtotal}>
                    <GridToolbar jRef={jRef} />
                </div>
            </div>       
    );
}

export default MultiValueCard;