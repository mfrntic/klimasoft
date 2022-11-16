import style from "./FunctionListItem.module.css";
import { IconContext } from "react-icons";
import { IoSettings } from 'react-icons/io5';


function FunctionListItem({ climateFunction }) {

    // function onSelectHandler() {
    //     onSelect(measure);
    // }

    return (
        // <div className={`${style.measureItem} ${isSelected && style.selected}`} onClick={onSelectHandler}>
        <div className={`${style.functionItem}`}>
            <div>
                <input id={climateFunction.title} type="checkbox" className={style.checkbox} />
                <label htmlFor={climateFunction.title} className={style.title} title={climateFunction.title}>{climateFunction.title}</label>
                <IconContext.Provider value={{ className: style.icons, size: "1.25em" }}>
                    <span className={style.arrowRight}> <IoSettings /></span>
                </IconContext.Provider>
            </div>
            <div className={style.description}>
                {climateFunction.description}
            </div>

        </div>
    );
}

export default FunctionListItem;