import { Fragment } from "react";
import { useSelector } from "react-redux";
import { Measures } from "../../../data/Measures";
import GridTotal from "../../project/GridTotal";

function DescriptivePercipitation({calculation}) {
    const measures = Measures.filter(a=>a.GroupName === "Oborine");
    console.log("DT", measures);
    const data = useSelector(a=>a.project.data);

    return (
        <div>
            <h3>{calculation.title}</h3>
            {measures.map(m => {
                 return <Fragment key={m.IDMeasure}>
                    <h4>{m.TypeName}</h4>
                 <GridTotal measure={m} projectdata={data} />
                 </Fragment>
            })}
        </div>
    )
}

export default DescriptivePercipitation;