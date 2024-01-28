import { Fragment, Suspense, lazy } from "react";
import DescriptivePercipitation from "./renderers/DescriptivePercipitation";
import DescriptiveTemperature from "./renderers/DescriptiveTemperature";
import Klimadijagram from "./renderers/Klimadijagram";
import Klimatogram from "./renderers/Klimatogram";
import MultiTotalCard from "./renderers/MultiTotalCard";
import MultiValueCard from "./renderers/MultiValueCard";
import ProjectInfo from "./renderers/ProjectInfo";
import SingleValueCard from "./renderers/SingleValueCard";
import Loading from "./Loading";


function FormulaRenderer({ formula }) {
    // const MultiValueCard = lazy(() => import("./renderers/MultiValueCard"))

    return (
      <>
            {formula.type === "ProjectInfo" && <ProjectInfo calculation={formula} />}
            {formula.type === "DescriptiveTemperature" && <DescriptiveTemperature calculation={formula} />}
            {formula.type === "DescriptivePercipitation" && <DescriptivePercipitation calculation={formula} />}
            {formula.type === "Klimadijagram" && <Klimadijagram calculation={formula} />}
            {formula.type === "Klimatogram" && <Klimatogram calculation={formula} />}
            {formula.type === "SingleValue" && <SingleValueCard calculation={formula} showDescription={false} />}
            {formula.type === "SingleValueDescription" && <SingleValueCard calculation={formula} showDescription={true} />}
            {/* {formula.type === "MultiValue" &&   <Suspense fallback={<Loading title={formula?.title}  />}><MultiValueCard calculation={formula} /></Suspense>} */}
            {formula.type === "MultiValue" &&  <MultiValueCard calculation={formula} />}
            {formula.type === "MultiValueTotal" && <MultiTotalCard calculation={formula} />}
            {formula.type === "MultiValueAverage" && <MultiValueCard calculation={formula} />}
            {formula.type === "MultiValueDescription" && <MultiTotalCard calculation={formula} />}
            {/* <pre key={formula.name} style={{ textAlign: "left" }}>
                {JSON.stringify(formula, null, 3)}
            </pre> */}
            </>
 
    )
}

export default FormulaRenderer;