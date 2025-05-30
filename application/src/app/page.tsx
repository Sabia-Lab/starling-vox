import styles from "./page.module.css";
import SearchInput from "./searchinput";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.title_container}>
        <img src="./logo.png" className={styles.logo}/>
        <h1 className={styles.title}>Starling Vox</h1>
      </div>
        <SearchInput />
    </div>
  );
}
