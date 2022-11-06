import style from "./MeasureDataListItem.module.css";
import { IconContext } from "react-icons";
import { IoArrowForwardCircleOutline, IoCheckmarkDone } from 'react-icons/io5';


function MeasureDataListItem({ measure, isSelected, isOk, onSelect }) {

    function onSelectHandler(){
        onSelect(measure);
    }

    return (
        <div className={`${style.measureItem} ${isSelected && style.selected}`} onClick={onSelectHandler}>
            <IconContext.Provider value={{ className: style.icons, size: "1.25em" }}>
                <span className={style.done}>{isOk && <IoCheckmarkDone />}</span>
                <span className={style.title}>{measure.TypeName}</span> 
                <span className={style.arrowRight}> <IoArrowForwardCircleOutline  /></span>
            </IconContext.Provider>
        </div>
    );
}

export default MeasureDataListItem;