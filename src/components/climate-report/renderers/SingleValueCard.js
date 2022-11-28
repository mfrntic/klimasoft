import { useSelector } from "react-redux";
import * as klimasoft from "../../../lib/klimatskeformule";
import { describe } from "../../../lib/mathUtils";

function SingleValueCard({ calculation, showDescription }) {

    const func = klimasoft[calculation.name].calculate;
    const data = useSelector(a => a.project.data);
    const parameters = calculation.parameters.map(p => {
        if (p.parameter === "temperatura" ||
            p.parameter === "oborine") {
            console.log(describe(data[p.value], "avg", false))
            return describe(data[p.value], "avg", false)[0];
        }
        else {
            return p.value;
        }
    });


    const res = func(...parameters);
    console.log("p", res);

    return (
        <div>
            <h3>{calculation.title}</h3>
            <div style={{ width: "500px", display: "block", margin: "auto", marginBottom: "2em" }}>
                <h4>{res.value}</h4>
                {showDescription && <h5>{res.result}</h5>}

            </div>
        </div>
    );
}

export default SingleValueCard;