import { useNavigate } from "react-router-dom";
import style from "./BackButton.module.css";
import { IconContext } from "react-icons";
import { FaArrowCircleLeft } from 'react-icons/fa';


function BackButton() {
    const navigate = useNavigate();

    function backButtonHandler() {
        // navigate(-1);
        window.api.climateReference(false);
    }

    return (
        <div className={style.backButton}>
            <button type="button"
                onClick={backButtonHandler}>
                <IconContext.Provider value={{ style: { verticalAlign: "bottom", marginRight: "10px" } }}>
                    <FaArrowCircleLeft />
                </IconContext.Provider>
                Povratak na projekt
            </button>
        </div>
    );
}

export default BackButton;