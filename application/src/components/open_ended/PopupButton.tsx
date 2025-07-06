"use client"

import {useState} from "react"
import styles from "./open_ended.module.css"
import OpenEndedContainer from "./OpenEndedContainer"

export default function PopupButton(){
  const[popup, setPopup] = useState(false);

  function handlePopup() {
    setPopup(true);
  }

  return(
    <div className = {styles.buttonContainer}>
     <button className={styles.button} onClick={handlePopup}>
      <p className={styles.buttonText}>Most & Least Liked Answers (Q15&16) </p>
     </button>
    {popup && <div className={styles.popupLayer}>
    <OpenEndedContainer courseName="DIT333 Fake Course" onClose={() => setPopup(false)}/> </div>} 
  </div>
  )
}
    