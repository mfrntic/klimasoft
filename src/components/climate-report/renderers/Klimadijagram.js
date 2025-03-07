import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import KD from "../../../lib/klimadijagram";

import Project, { Period, ProjectData, ProjectHeader } from "../../../models/klimasoft-project";
import { IconContext } from "react-icons";
import { FaDownload, FaCopy } from 'react-icons/fa';
import style from "./Klimadijagram.module.css";
import { calculate, describe } from "../../../lib/mathUtils";
// const { calculate, describe } = require("../../../lib/mathUtils");

function Klimadijagram({ calculation }) {

    // console.log("Klimadijagram", calculation);
    const [aridDur, setAridDur] = useState();
    const [aridnessDur, setAridnessDur] = useState();
    const projData = useSelector(a => a.project);

    const diag = useRef();

    useEffect(() => {
        const project = new Project(projData);
        const data = new ProjectData(project.data);
        const header = new ProjectHeader(project.header);
        // console.log("header", header);
        const period = new Period(header.period);
        // console.log("data", data);

        const meanTemp = describe(data.meanTemp).filter(a => a[0] === "avg")[0].slice(1, 13);
        const percs = describe(data.percipitation).filter(a => a[0] === "avg")[0].slice(1, 13);
        const ztm = [];


        const absMins = describe(data.absMinTemp).filter(a => a[0] === "min")[0].slice(1, 13);
        const avgMins = describe(data.avgMinTemp).filter(a => a[0] === "avg")[0].slice(1, 13);
        // console.log("avgMins", avgMins);
        const canCalcAbsMin = calculate(data.absMinTemp, 0, "count", 0) > 1;
        const canCalcAvgMin = calculate(data.avgMinTemp, 0, "count", 0) > 1;

        console.log(canCalcAbsMin)

        for (let i = 0; i < 12; i++) {
            if (canCalcAvgMin && avgMins.length >= i && avgMins[i] <= 0) {
                ztm.push("s");
            }
            else if (canCalcAbsMin && absMins.length >= i && absMins[i] <= 0) {
                ztm.push("a");
            }
            else {
                ztm.push("");
            }
        }

        let show_months = calculation.parameters.find(a => a.parameter === "show_months")?.value;
        show_months = (show_months?.toString() === "true" ? true : false);
        // console.log("show_months 2", show_months);
        let show_aridness = calculation.parameters.find(a => a.parameter === "show_aridness")?.value;
        show_aridness = (show_aridness?.toString() === "true" ? true : false);
        //  console.log("show_aridness", calculation.parameters, show_aridness);

        let show_vegetation_period = calculation.parameters.find(a => a.parameter === "show_vegetation_period")?.value;
        show_vegetation_period = (show_vegetation_period?.toString() === "true" ? true : false);

        let show_credits = calculation.parameters.find(a => a.parameter === "show_credits")?.value;
        show_credits = (show_credits?.toString() === "true" ? true : false);

        var options = {
            temp: meanTemp,
            perc: percs,
            show_aridness: show_aridness,
            show_months: show_months,
            header_data: {
                station_name: header.station.StationName,
                station_altitude: header.station.Altitude,
                yow_period: period.getYears()
            },

            zero_temp_months: ztm,
            show_vegetation_period: show_vegetation_period,
            show_axis: true,
            interactive: false,
            show_cardinal_temp: true,
            show_axis_scales: true,
            cardinal_temp: {
                abs_min: calculate(data.absMinTemp, 0, "min", 2),
                abs_max: calculate(data.absMaxTemp, 0, "max", 2),
                avg_min: calculate(data.avgMinTemp, 0, "min", 2),
                avg_max: calculate(data.avgMaxTemp, 0, "max", 2)
            },
            credits: "sumfak.unizg.hr",
            show_credits: show_credits,
            onready: () => {
                diag.current.draw();
                const arid = diag.current.aridPeriodDuration();
                const aridness = diag.current.aridnessPeriodDuration();

                if (arid.totalDays > 0) {
                    setAridDur(arid.periodText() + " (" + arid.totalDays + " dana)");
                }
                if (aridness.totalDays > 0) {
                    setAridnessDur(aridness.periodText() + " (" + aridness.totalDays + " dana)");
                }
            }
            //margin_left: 0
        };

        diag.current = new KD.Diagram(document.getElementById("kd"), options);

    }, [calculation, projData]);

    function onSaveImageHandler() {
        diag.current.toImage("download");
    }

    function onCopyImageHandler() {
        diag.current.toImage("dataurl", (dataURL) => {
            window.api.copyImage(dataURL);
        });

    }

    return (
        <div>
            <h3>{calculation.title}</h3>
            <div className={style.toolbar}>
                <IconContext.Provider value={{ className: style.icons, size: "0.95em" }}>
                    <button type="button" title="Spremi sliku" onClick={onSaveImageHandler} ><FaDownload /></button>
                    <button type="button" title="Kopiraj sliku" onClick={onCopyImageHandler}><FaCopy /></button>
                </IconContext.Provider>
            </div>
            <canvas id="kd" width="400" height="550" style={{ width: 400, height: 550 }}></canvas>

            {aridDur && <p className={style.info}>
                <label>Razdoblje suše: </label>
                <span>{aridDur}</span>
            </p>}
            {aridnessDur && <p className={style.info}>
                <label>Razdoblje suhoće: </label>
                <span>{aridnessDur}</span>
            </p>}
        </div>
    )
}

export default Klimadijagram;