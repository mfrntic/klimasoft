import style from "./FunctionList.module.css";
import FunctionListItem from "./FunctionListItem";
import { useState } from "react";
import { useSelector } from "react-redux";
import * as klimasoft from "../../lib/klimatskeformule";

// import FunctionListItem from "./FunctionListItem";

function FunctionList() {
  const [searchValue, setSearchValue] = useState("");
  const formule = useSelector((a) => a.project.calculations);

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
        {formule
          .filter((a) => searchValue.length === 0 || klimasoft[a.name].title?.toLowerCase().includes(searchValue.toLowerCase()))
          .map((formula, i) => (
            <FunctionListItem key={i} climateFunction={formula} />
          ))}
      </div>
    </div>
  );
}

export default FunctionList;
