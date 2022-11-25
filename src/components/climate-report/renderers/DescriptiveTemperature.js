import { Fragment } from "react";
import { useSelector } from "react-redux";
import { Measures } from "../../../data/Measures";
import Project from "../../../models/klimasoft-project";
import GridTotal from "../../project/GridTotal";

function DescriptiveTemperature({ calculation }) {
    const measures = Measures.filter(a => a.GroupName === "Temperatura");
    // console.log("DT", measures);
    const projectData = useSelector(a => a.project);
    const project = new Project(projectData);

    // console.log(project, projectData);

    return (
        <div>
            <h3>{calculation.title}</h3>
            {measures.map(m => {
                return <Fragment>
                    <h4>{m.TypeName} ({project.header.period.toString()})</h4>
                    <GridTotal measure={m} projectdata={project.data} />
                </Fragment>
            })}
        </div>
    )
}

export default DescriptiveTemperature;