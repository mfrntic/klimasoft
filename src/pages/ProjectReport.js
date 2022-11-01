import Layout from "../components/layout/Layout";
import ProjectNotSelected from "../components/project/ProjectNotSelected";
import style from "./ProjectReport.module.css";

function ProjectReport() {
    return (
        <Layout>
            <div className={style.page}>
                <ProjectNotSelected />
            </div>
        </Layout>
    )
}

export default ProjectReport;