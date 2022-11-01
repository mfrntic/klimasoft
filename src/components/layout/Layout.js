import style from "./Layout.module.css";
import ProjectMenu from "../project/ProjectMenu";


function Layout(props) {
    return (
        <section className={style.app}>
            <header>
                <ProjectMenu />
            </header>
            <section className={style.body}>
                {props.children}
            </section>
        </section>
    )
}

export default Layout;