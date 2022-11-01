import Layout from "../components/layout/Layout";
import ProjectNotSelected from "../components/project/ProjectNotSelected";
import style from "./ProjectData.module.css";


function ProjectData() {
    return (
        <Layout>
            <div className={style.page}>
                <ProjectNotSelected />
            </div>
        </Layout>
    )
}

export default ProjectData;