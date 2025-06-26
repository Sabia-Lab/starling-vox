"use client";

import styles from "./list.module.css";

export type ListItem = {
  image?: string;
  title: string;
  description: string;
};

export default function List({ data }: { data: ListItem[] }) {
  const handleClick = (title: string) => {
    // Placeholder for future click functionality
    console.log(`Clicked on: ${title}`);
  };

  return (
    <>
      {data.map((item, index) => (
        <div
          key={index}
          className={styles.list_item}
          onClick={() => handleClick(item.title)}
        >
          <div className={styles.icon_circle}>
            {item.title.charAt(0).toUpperCase()}
          </div>
          {item.title}
        </div>
      ))}
    </>
  );
}