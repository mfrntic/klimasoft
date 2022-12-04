import BackButton from "../components/reference/BackButton";
import ClimateReference from "../components/reference/ClimateReference";
import style from "./Reference.module.css";
 
function Reference() {
   

    return (
        <section className={style.reference}>
            <BackButton />
            <ClimateReference />
        </section>

    )
}

export default Reference;