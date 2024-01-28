import { FaSpinner } from "react-icons/fa";

import style from "./Loading.module.css";

function Loading({ title }) {
    return (
    <div>
        <h3>{title}</h3>
        <div><FaSpinner icon="spinner" size={"1.5em"} className={style.spinner} /></div>
    </div>
    )
}

export default Loading;