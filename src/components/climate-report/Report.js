import style from "./Report.module.css";
import { useSelector } from "react-redux";
import FormulaRenderer from "./FormulaRenderer";
import * as klimasoft from "../../lib/klimatskeformule";

function Report() {
    const grupe = [];
    let calculations = useSelector(a => a.project.calculations);
    try {
        calculations = calculations.filter(a => klimasoft[a.name]?.title.length > 0);

        for (const f of calculations) {
            const calc = klimasoft[f.name];
            // console.log(calc);
            if (calc.group) {
                if (!grupe.includes(calc.group)) {
                    grupe.push(calc.group);
                }
            }
        }
        grupe.sort();
    }
    catch { }
    //console.log("grupe", grupe);
    return <section className={style.report}>
        {grupe.map(g => {
            return <section key={g}>
                {calculations.filter(a => klimasoft[a.name].group === g && a.selected)
                    .map(c => <FormulaRenderer key={c.name} formula={c} />)}
            </section>
        })}
    </section>
}

export default Report;