"use client";
import styles from "@/app/page.module.css";
import List, { ListItem } from "@/components/list/list";
import SearchInput from "@/components/search/searchinput";
import { ReactSVG } from "react-svg";

export default function Home() {
  const data: Array<ListItem> = [
    {
      title: "Test3",
      description: "Description",
    },
    {
      title: "Test2",
      description: "Description",
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.title_container}>
        <ReactSVG src="images/logo.svg" className={styles.logo} />
        <h1 className={styles.title}>Starling Vox</h1>
      </div>
      <SearchInput />
      <List data={data} />
    </div>
  );
}
