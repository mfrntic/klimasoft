import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import KD from "../../../lib/klimadijagram";
import { max, min } from "../../../lib/mathUtils";
import Project, { ProjectData, ProjectHeader } from "../../../models/klimasoft-project";
import style from "./Klimatogram.module.css";
import { IconContext } from "react-icons";
import { FaDownload, FaCopy } from 'react-icons/fa';
// const {max, min} = require("../../../lib/mathUtils");

function Klimatogram({ calculation }) {

    const projData = useSelector(a => a.project);

    const diag = useRef();

    useEffect(() => {
        const project = new Project(projData);
        const data = new ProjectData(project.data);
        const header = new ProjectHeader(project.header);
        // const period = new Period(header.period);
        // console.log("data", data);

        const kgdata = [];
        const years = data.getYears();
        //   console.log("years", years);
        for (let year of years) {
            //temp
            const temp = data.meanTemp.filter(a => a[0] == year); //returns array in array [[]]!
            const perc = data.percipitation.filter(a => a[0] == year);

            if (temp.length > 0 && perc.length > 0) {

                const abs_min = data.absMinTemp.filter(a => a[0] == year)[0]?.slice(1, 13);
                const abs_max = data.absMaxTemp.filter(a => a[0] == year)[0]?.slice(1, 13);
                const avg_min = data.avgMinTemp.filter(a => a[0] == year)[0]?.slice(1, 13);
                const avg_max = data.avgMaxTemp.filter(a => a[0] == year)[0]?.slice(1, 13);

                const ztm = [];

                for (let i = 0; i < 12; i++) {
                    if (avg_min.length >= i && avg_min[i] < 0) {
                        ztm.push("s");
                    }
                    else if (abs_min.length >= i && abs_min[i] < 0) {
                        ztm.push("a");
                    }
                    else {
                        ztm.push("");
                    }
                }

                const d = {
                    year: year,
                    temp: temp[0].slice(1, 13).map(a => !a ? 0 : a),
                    perc: perc[0].slice(1, 13).map(a => !a ? 0 : a),
                    cardinal_temp: {
                        abs_min: min(abs_min),
                        abs_max: max(abs_max),
                        avg_max: max(avg_max),
                        avg_min: min(avg_min)
                    },
                    zero_temp_months: ztm,

                }

                kgdata.push(d);
            }
        }


        let show_months = calculation.parameters.find(a => a.parameter === "show_months")?.value;
        show_months = (show_months?.toString() === "true" ? true : false);
        // console.log("show_months 2", show_months);
        let show_aridness = calculation.parameters.find(a => a.parameter === "show_aridness")?.value;
        show_aridness = (show_aridness?.toString() === "true" ? true : false);
        //  console.log("show_aridness", calculation.parameters, show_aridness);
        let years_in_row = calculation.parameters.find(a => a.parameter === "years_in_row")?.value;

        var options = {
            header_data: {
                station_name: header.station.StationName,
                station_altitude: header.station.Altitude,
            },
            data: kgdata,
            years_in_row: years_in_row,
            show_aridness: show_aridness,
            show_months: show_months,
            show_cardinal_temp: true,
            show_axis_scales: true,
            onready: function () {
                diag.current.draw();
            }
        };

        diag.current = new KD.Klimatogram(document.getElementById("klimatogram"), options);

    }, [calculation, projData]);

    function onSaveImageHandler() {
        diag.current.toImage("download");
    }

    function onCopyImageHandler() {
        const dataURL = diag.current.toImage("dataurl");
        // console.log("dataURL", dataURL);
        window.api.copyImage(dataURL);
    }

    return (
        <div>
            <h3>{calculation.title}</h3>
            <div className={style.toolbar}>
                <IconContext.Provider value={{ className: style.icons, size: "0.95em" }}>
                    <button type="button" title="Spremi sliku" onClick={onSaveImageHandler} ><FaDownload /></button>
                    <button type="button" title="Kopiraj sliku" onClick={onCopyImageHandler} ><FaCopy /></button>
                </IconContext.Provider>
            </div>
            <canvas id="klimatogram" width="980" height="100"></canvas>
        </div>
    )
}

export default Klimatogram;

