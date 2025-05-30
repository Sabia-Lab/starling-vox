"use client"
import styles from "@/app/page.module.css";
import SearchInput from "@/components/search/searchinput";
import { ReactSVG } from "react-svg";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.title_container}>
        <ReactSVG src="images/logo.svg" className={styles.logo} />
        <h1 className={styles.title}>Starling Vox</h1>
      </div>
      <SearchInput />
    </div>
  );
}
