import style from "./FunctionList.module.css";
import * as klimasoft from "../../lib/klimatskeformule";
import FunctionListItem from "./FunctionListItem";
import { useState } from "react";

// import FunctionListItem from "./FunctionListItem";

function FunctionList() {

    const [searchValue, setSearchValue] = useState("");
    const formule = []

    for (const formula in klimasoft) {
        if (klimasoft[formula].title) {
            formule.push(klimasoft[formula]);
        }
    }

    function onSearchChangeHandler(e) {
        const val = e.target.value;
        setSearchValue(val);
    }

    return (
        <div>
            <div className={style.search}>
                <input placeholder="Pretraživanje funkcija..." value={searchValue} onChange={onSearchChangeHandler} />
            </div>
            <div className={style.functions}>
                {formule.filter(a => searchValue.length === 0 || a.title?.toLowerCase().includes(searchValue)).map((formula, i) => <FunctionListItem key={i} climateFunction={formula} />)}
            </div>
        </div>
    )
}

export default FunctionList;