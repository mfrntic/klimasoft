import { Fragment } from "react";
import DescriptivePercipitation from "./renderers/DescriptivePercipitation";
import DescriptiveTemperature from "./renderers/DescriptiveTemperature";
import Klimadijagram from "./renderers/Klimadijagram";
import Klimatogram from "./renderers/Klimatogram";
import ProjectInfo from "./renderers/ProjectInfo";


function FormulaRenderer({ formula }) {

    return (
        <Fragment>
            {formula.type === "ProjectInfo" && <ProjectInfo calculation={formula} />}
            {formula.type === "DescriptiveTemperature" && <DescriptiveTemperature calculation={formula} />}
            {formula.type === "DescriptivePercipitation" && <DescriptivePercipitation calculation={formula} />}
            {formula.type === "Klimadijagram" && <Klimadijagram calculation={formula} />}
            {formula.type === "Klimatogram" && <Klimatogram calculation={formula} />}
            {/* <pre key={formula.name}>
                {JSON.stringify(formula, null, 3)}
            </pre>
            <hr /> */}
        </Fragment>
    )
}

export default FormulaRenderer;