import style from "./FunctionList.module.css";
import FunctionListItem from "./FunctionListItem";
import { useState } from "react";
import { useSelector } from "react-redux";
import * as klimasoft from "../../lib/klimatskeformule";

// import FunctionListItem from "./FunctionListItem";

function FunctionList() {
  const [searchValue, setSearchValue] = useState("");
  let formule = useSelector((a) => a.project.calculations);
  formule = formule.filter(a => klimasoft[a.name]?.title.length > 0);
  // formule.sort((a, b) => { return a.type.localeCompare(b.type)});

  const grupe = [];
  for (const f of formule) {
    const calc = klimasoft[f.name];
    // console.log(calc);
    if (calc.group) {
      if (!grupe.includes(calc.group)) {
        grupe.push(calc.group);
      }
    }
  }
  grupe.sort();
  

  // console.log("grupe", grupe);

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
        {
          grupe.map(g => {
            return <div key={g}>
              {formule.filter((a) => klimasoft[a.name].group === g && (searchValue.length === 0 || klimasoft[a.name].title?.toLowerCase().includes(searchValue.toLowerCase()))).length > 0 && <h3>{g}</h3>}
              <div>
                {formule.filter((a) => klimasoft[a.name].group === g && (searchValue.length === 0 || klimasoft[a.name].title?.toLowerCase().includes(searchValue.toLowerCase()))) //izbaci višak
                  .map((formula, i) => (
                    <FunctionListItem key={i} climateFunction={formula} />
                  ))}
              </div>
            </div>
          })

        }
      </div>
    </div>
  );
}

export default FunctionList;
