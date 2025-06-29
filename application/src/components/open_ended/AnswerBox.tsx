import styles from './open_ended.module.css';
import Answer from './answer';
import { useState, useEffect } from 'react';

// This component is for a box containing multiple answers

// *most or least liked things with the course.
type answerBoxProps = {
    mostOrLeast: "most" | "least";
    courseName: string;
};

function readAnswers(type: string) {
    
}

export default function AnswerBox({ mostOrLeast, courseName }: answerBoxProps) {
    const [answers, setAnswers] = useState<string[]>([]);

    useEffect(() => {
        let path: string = "evaluation_results/" + courseName + " Open Ended.json";
        let index: number = -1;
        switch (mostOrLeast) {
            case "most":
                index = 0;
                break;
            case "least":
                index = 1;
        };

        fetch(path)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setAnswers(data[index]["answers"]);
            })
        
        console.log("It's working");
        console.log(path);
        console.log(answers);
    }, [mostOrLeast, courseName]);

    


    return (
        <div className={styles.answerBoxContainer}>
            <h5 className={styles.answerBoxHeader}>
                "What are the three things you liked the {mostOrLeast} about the course?"
            </h5>
            {answers.map((answer, i) => (
                <Answer key={i} text={answer} />
            ))}

        </div>
    )
}