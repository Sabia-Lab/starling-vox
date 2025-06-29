import AnswerBox from './AnswerBox';
import styles from './open_ended.module.css';

// This component is for grouping the most and least liked answer boxes together

type course = {
    courseName: string;
}

export default function OpenEndedContainer({ courseName }: course) {
    

    return (
        <div className={styles.mainContainer}>
            <AnswerBox mostOrLeast="most" courseName={courseName} />
            <AnswerBox mostOrLeast="least" courseName={courseName} />
        </div> 
    )
}