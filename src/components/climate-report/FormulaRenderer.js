import { Fragment } from "react";
import DescriptivePercipitation from "./renderers/DescriptivePercipitation";
import DescriptiveTemperature from "./renderers/DescriptiveTemperature";
import ProjectInfo from "./renderers/ProjectInfo";
 

function FormulaRenderer({ formula }) {
     
    return (
        <Fragment>
            {formula.type === "ProjectInfo" && <ProjectInfo calculation={formula} />}
            {formula.type === "DescriptiveTemperature" && <DescriptiveTemperature  calculation={formula}/>}
            {formula.type === "DescriptivePercipitation" && <DescriptivePercipitation  calculation={formula}/>}
            {formula.type === "Klimadijagram" && <div>Klimadijagram</div>}
            {formula.type === "Klimatogram" && <div>Klimatogram</div>}
            {/* <pre key={formula.name}>
                {JSON.stringify(formula, null, 3)}
            </pre>
            <hr /> */}
        </Fragment>
    )
}

export default FormulaRenderer;