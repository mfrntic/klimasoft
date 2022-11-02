import ProjectForm from "../components/project/ProjectForm";
import style from "./NewProjectDialog.module.css";

function NewProjectDialog() {
    return (
        <div className={style.newProject}>

            <ProjectForm />
        </div>
    );
}

export default NewProjectDialog;