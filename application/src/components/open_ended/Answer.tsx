import styles from './open_ended.module.css'

// This component is for a single box of text

type openEndedAnswer = {
    text: string
}

export default function Answer({ text }: openEndedAnswer) {
    return (
        <div className={styles.singleAnswerContainer}>
            <p className={styles.answerParagraph}>
                {text}
            </p>
        </div>
    )
}