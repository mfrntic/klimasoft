import { IconContext } from "react-icons";
import { IoCaretForwardCircleOutline } from 'react-icons/io5'; 
import style from "./StationListItem.module.css";

function StationListItem({ station, onSelected }) {
 
    function onItemClickHandler(){
        onSelected(station)
    }

    return (
        <div className={style.item} onClick={onItemClickHandler}>
            <span>{station.StationName}</span>

            <IconContext.Provider value={{ size: "1.5em", className: style.icon }}>
                <span><IoCaretForwardCircleOutline /></span>
            </IconContext.Provider>

            <span className={style.type}>{station.StationTypeName}</span>
        </div>
    );
}

export default StationListItem;