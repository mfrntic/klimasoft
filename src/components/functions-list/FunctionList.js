import style from "./FunctionList.module.css";
import * as klimasoft from "../../lib/klimatskeformule";
import FunctionListItem from "./FunctionListItem";

// import FunctionListItem from "./FunctionListItem";

function FunctionList() {

    const formule = []
    for (const formula in klimasoft) {
        if (klimasoft[formula].title) {
            formule.push(klimasoft[formula]);
        }
    }

    return (
        <div className={style.functions}>
            {formule.map((formula, i) => <FunctionListItem climateFunction={formula} />)}
        </div>
    )
}

export default FunctionList;