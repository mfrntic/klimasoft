import { useSelector } from "react-redux";
import ProjectCard from "../../project/ProjectCard";

function ProjectInfo({ calculation }) {
    const project = useSelector(a => a.project.header);
    return (
        <div style={{ width: "300px", display: "block", margin: "auto", marginBottom: "2em" }}>
            <ProjectCard project={project} />
        </div>
    );
}

export default ProjectInfo;