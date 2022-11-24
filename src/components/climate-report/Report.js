import style from "./Report.module.css";
import { useSelector } from "react-redux";

function Report() {
    const calculations = useSelector(a => a.project.calculations);
    return <section className={style.report}>
        {calculations.map(c => {
            return <div className={style.item}>
                {JSON.stringify(c)} 
            </div>
        })}
    </section>
}

export default Report;