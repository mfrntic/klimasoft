import { useEffect } from "react";
import { useSelector } from "react-redux";
import KD from "../../../lib/klimadijagram";
import { calculate, describe, max, min } from "../../../lib/mathUtils";
import Project, { Period, ProjectData, ProjectHeader } from "../../../models/klimasoft-project";

function Klimatogram({ calculation }) {

    const projData = useSelector(a => a.project);

    useEffect(() => {
        const project = new Project(projData);
        const data = new ProjectData(project.data);
        const header = new ProjectHeader(project.header);
        const period = new Period(header.period);
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
                    if (avg_min.length >= i && avg_min[i] <= 0) {
                        ztm.push("s");
                    }
                    else if (abs_min.length >= i && abs_min[i] <= 0) {
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
                    zero_temp_months: ztm
                }

                kgdata.push(d);
            }
        }
        console.log(kgdata);

        // const ztm = [];
        // const absMins = describe(data.absMinTemp).filter(a => a[0] === "min")[0].slice(1, 13);
        // const avgMins = describe(data.avgMinTemp).filter(a => a[0] === "min")[0].slice(1, 13);

        // for (let i = 0; i < 12; i++) {
        //     if (avgMins.length >= i && avgMins[i] <= 0) {
        //         ztm.push("s");
        //     }
        //     else if (absMins.length >= i && absMins[i] <= 0) {
        //         ztm.push("a");
        //     }
        //     else {
        //         ztm.push("");
        //     }
        // }

        var options = {
            header_data: {
                station_name: header.station.StationName,
                station_altitude: header.station.Altitude,
            },
            data: kgdata,
            years_in_row: 7,
            show_aridness: true,
            show_months: false,
            show_cardinal_temp: true,
            show_axis_scales: true,
            onready: function () {
                diag.draw();
            }
        };

        let diag = new KD.Klimatogram(document.getElementById("klimatogram"), options);


    }, [calculation, projData]);


    return (
        <div>
            <h3>{calculation.title}</h3>
            <canvas id="klimatogram" width="980" height="100"></canvas>
        </div>
    )
}

export default Klimatogram;

