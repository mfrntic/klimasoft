import ProjectForm from "../components/project-form/ProjectForm";
import style from "./NewProjectDialog.module.css";

function NewProjectDialog() {
    return (
        <div className={style.newProject}>
            <ProjectForm />
        </div>
    );
}

export default NewProjectDialog;