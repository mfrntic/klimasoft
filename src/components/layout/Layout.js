import style from "./Layout.module.css";
import ProjectMenu from "../project/ProjectMenu";
import { ToastContainer } from "react-toastify";


function Layout(props) {
    return (
        <section className={style.app}>
            <header>
                <ProjectMenu />
            </header>
            <section className={style.body}>
                {props.children}
            </section>
            <ToastContainer position="bottom-right"
                autoClose={1500}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastClassName={style.toast} 
                style={{width: "auto", minWidth: "160px"}}
                />
        </section>
    )
}

export default Layout;