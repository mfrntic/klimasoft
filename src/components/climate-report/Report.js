import style from "./Report.module.css";
import { useSelector } from "react-redux";
import FormulaRenderer from "./FormulaRenderer";

function Report() {
    const calculations = useSelector(a => a.project.calculations);

    return <section className={style.report}>
        {calculations.filter(a => a.selected).map(c => <FormulaRenderer formula={c} />)}
    </section>
}

export default Report;