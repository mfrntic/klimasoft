import style from "./FunctionListItem.module.css";
import { IconContext } from "react-icons";
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { useState } from "react";
import ParameterItem from "./ParameterItem";

function getArguments(func) {
    const ARROW = true;
    const FUNC_ARGS = ARROW ? /^(function)?\s*[^(]*\(\s*([^)]*)\)/m : /^(function)\s*[^(]*\(\s*([^)]*)\)/m;
    const FUNC_ARG_SPLIT = /,/;
    const FUNC_ARG = /^\s*(_?)(.+?)\1\s*$/;
    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

    return ((func || '').toString().replace(STRIP_COMMENTS, '').match(FUNC_ARGS) || ['', '', ''])[2]
        .split(FUNC_ARG_SPLIT)
        .map(function (arg) {
            return arg.replace(FUNC_ARG, function (all, underscore, name) {
                return name.split('=')[0].trim();
            });
        })
        .filter(String);
}

function FunctionListItem({ climateFunction }) {

    const [showMore, setShowMore] = useState(false);
    function showMoreHandler() {
        setShowMore((state) => !state);
    }

    const args = getArguments(climateFunction.calculate);

    return (
        // <div className={`${style.measureItem} ${isSelected && style.selected}`} onClick={onSelectHandler}>
        <div className={`${style.functionItem}`}>
            <div>
                <input id={climateFunction.title} type="checkbox" className={style.checkbox} />
                <label htmlFor={climateFunction.title} className={style.title} title={climateFunction.title}>{climateFunction.title}</label>
                <IconContext.Provider value={{ className: style.icons, size: "1.25em" }}>
                    <button type="button" title="Prikaži više mogućnosti" className={style.arrowRight} onClick={showMoreHandler}><IoEllipsisHorizontal /></button>
                </IconContext.Provider>
            </div>
            {showMore && <div>
                <hr></hr>
                <div className={style.description}>
                    {climateFunction.description}
                </div>
                <div className={style.parameters}>
                    <h4>Parametri:</h4>
                    {
                        args.map((a) => {
                            console.log(a);
                            return <ParameterItem key={a} parameter={a} />
                        })
                    }
                </div>
            </div>}

        </div>
    );
}

export default FunctionListItem;