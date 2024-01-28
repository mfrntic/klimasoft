import style from "./FunctionListItem.module.css";
import { IconContext } from "react-icons";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { useState } from "react";
import ParameterItem from "./ParameterItem";
import * as klimasoft from "../../lib/klimatskeformule";
import { useDispatch } from "react-redux";
import { projectActions } from "../../store/projectSlice";

function FunctionListItem({ climateFunction }) {
  const [showMore, setShowMore] = useState(false);
  const funkcija = klimasoft[climateFunction.name];
  // console.log("climateFunction", climateFunction);

  const dispatch = useDispatch();

  function showMoreHandler() {
    setShowMore((state) => !state);
  }

  function onFunctionSelectedHandler(e) {
    const val = e.target.checked;
    dispatch(
      projectActions.calculationSelect({
        functionName: climateFunction.name,
        selected: val,
      })
    );
  }

  //   console.log("climateFunction", climateFunction);

  return (
    // <div className={`${style.measureItem} ${isSelected && style.selected}`} onClick={onSelectHandler}>
    <div className={`${style.functionItem} ${showMore ? style.expanded : null}`}>
      <div>
        <input id={funkcija.name} type="checkbox" className={style.checkbox} checked={climateFunction.selected} onChange={onFunctionSelectedHandler} />
        <label htmlFor={funkcija.name} className={style.title} title={funkcija.title}>
          {funkcija.title}
        </label>
        <IconContext.Provider value={{ className: style.icons, size: "1.25em" }}>
          <button type="button" title="Prikaži više mogućnosti" className={style.arrowRight} onClick={showMoreHandler}>
            <IoEllipsisHorizontal />
          </button>
        </IconContext.Provider>
      </div>
      {showMore && (
        <div>
          <hr />
          <div className={style.description}>{funkcija.description}</div>
          {climateFunction.parameters?.length > 0 && <div className={style.parameters}>
            <h4>Parametri:</h4>
            {climateFunction.parameters?.map((a) => {
              return <ParameterItem key={a.parameter}
                parameter={a}
                functionName={funkcija.name} />
            })}
          </div>}
        </div>
      )}
    </div>
  );
}

export default FunctionListItem;
