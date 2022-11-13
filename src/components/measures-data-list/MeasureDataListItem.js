import style from "./MeasureDataListItem.module.css";
import { IconContext } from "react-icons";
import { IoArrowForwardCircleOutline, IoCheckmarkDone } from 'react-icons/io5';


function MeasureDataListItem({ measure, isSelected, hasData, onSelect }) {

    function onSelectHandler() {
        onSelect(measure);
    }

    return (
        <div className={`${style.measureItem} ${isSelected && style.selected}`} onClick={onSelectHandler}>
            <IconContext.Provider value={{ size: "1.25em" }}>
                <span className={style.done}>{hasData && <IoCheckmarkDone />}</span>
            </IconContext.Provider>
            <span className={style.title} title={measure.TypeName}>{measure.TypeName}</span>
            <IconContext.Provider value={{ className: style.icons, size: "1.25em" }}>
                <span className={style.arrowRight}> <IoArrowForwardCircleOutline /></span>
            </IconContext.Provider>
        </div>
    );
}

export default MeasureDataListItem;