import { useSelector } from "react-redux";
import FunctionList from "../components/functions-list/FunctionList";
import Layout from "../components/layout/Layout";
import ProjectNotSelected from "../components/project/ProjectNotSelected";
import Project from "../models/klimasoft-project";
import style from "./ProjectReport.module.css";

function ProjectReport() {

    // const activeProject = window.api.getActiveProject();
    const activeProjectData = useSelector(a => a.project);
    //    console.log("activeProjectData", activeProjectData);
    const activeProject = Project.fromObject(activeProjectData);
    //   console.log("activeProject", activeProject);


    return (
        <Layout>
            <div className={`${style.page} ${activeProject?.header.isValid() ? null : style.fullHeight}`}>
                {activeProject?.header.isValid() && <div className={style.reports}>
                    <div className={style.reportsMenu}>
                        <div className={style.sticky}>
                            <FunctionList />
                        </div>
                    </div>
                    <div className={style.reportsData}>

                    </div>
                </div>}
                {!activeProject?.header.isValid() && <ProjectNotSelected />}
            </div>
        </Layout >
    )
}

export default ProjectReport;