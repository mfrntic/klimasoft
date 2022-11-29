import { useSelector } from "react-redux";
import { Measures } from "../../../data/Measures";
import * as klimasoft from "../../../lib/klimatskeformule";
import { describe } from "../../../lib/mathUtils";
import style from "./SingleValueCard.module.css";

function SingleValueCard({ calculation, showDescription }) {

    const func = klimasoft[calculation.name];
    const data = useSelector(a => a.project.data);
    const parameters = calculation.parameters.map(p => {
        const measure = Measures.find(a => a.IDMeasure === p.value);
        if (measure) {
            return describe(data[p.value], measure.Aggregation, false)[0];
        }


        else {
            return p.value;
        }
    });


    const res = func.calculate(...parameters);
    console.log("p", res);

    return (
        <div>
            <h3>{calculation.title}</h3>
            <div className={style.card} >
                <h4>{res.value}</h4>    
                {showDescription && <h5>{res.result}</h5>}        
            </div>

            <p className={style.description}>{func.description}</p>
        </div>
    );
}

export default SingleValueCard;