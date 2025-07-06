import AnswerBox from './AnswerBox';
import styles from './open_ended.module.css';
import { ReactSVG } from "react-svg";

// This component is for grouping the most and least liked answer boxes together.

type props = {
    courseName: string;
    onClose: () => void
}

export default function OpenEndedContainer({ courseName,onClose }: props) {
    return (
        <div className={styles.mainContainer}>
            <AnswerBox mostOrLeast="most" courseName={courseName} />
            <AnswerBox mostOrLeast="least" courseName={courseName} />

        <button className={styles.closeButton} onClick={onClose}>
         <ReactSVG src="images/close_button.svg" />
        </button>
        </div> 
    )
}
