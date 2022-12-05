// import { describe } from "../../lib/mathUtils";
import style from "./GridTotal.module.css";
import jspreadsheet from "jspreadsheet-ce";
import "jspreadsheet-ce/dist/jspreadsheet.css";
import { useEffect, useRef } from "react";
import GridToolbar from "./GridToolbar";
const { describe } = require("../../lib/mathUtils");

function GridTotal({ projectdata, measure }) {
    const jRef = useRef(null);

    useEffect(() => {
        if (!jRef.current) return;
        if (!jRef.current.jspreadsheet) {
            const options = {
                // data: [...d],
                minDimensions: [14, 1],
                columns: [
                    { title: ' ', width: 90 },
                    { title: 'sij' },
                    { title: 'velj' },
                    { title: 'ožu' },
                    { title: 'tra' },
                    { title: 'svi' },
                    { title: 'lip' },
                    { title: 'srp' },
                    { title: 'kol' },
                    { title: 'ruj' },
                    { title: 'lis' },
                    { title: 'stu' },
                    { title: 'pro' },
                    { title: 'uk.', width: 90 }
                ],
                contextMenu: false,
                editable: false
            };

            jspreadsheet(jRef.current, options);
            jRef.current.jspreadsheet.hideIndex(0);
        }
    }, [])

    useEffect(() => {
        if (projectdata && measure) {
            // console.log("GridTotal", projectdata, measure);
            jRef.current.jspreadsheet.setData(describe(projectdata[measure.IDMeasure]));
        }
    }, [projectdata, measure])


    return (

        <div ref={jRef} className={style.gridtotal}>
            <GridToolbar jRef={jRef} measure={measure} />
        </div>

    )
}

export default GridTotal;