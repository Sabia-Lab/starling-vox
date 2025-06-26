"use client";
import styles from "@/app/page.module.css";
import List, { ListItem } from "@/components/list/list";
import SearchInput from "@/components/search/searchinput";
import { ReactSVG } from "react-svg";
import { useState } from "react";

const testData: Array<ListItem> = [
  {
    title: "Test3",
    description: "Description",
  },
  {
    title: "Test2",
    description: "Description",
  },
];


export default function Home() {
    // State to track the current value of the search input
  const [inputValue, setInputValue] = useState("");
  const [filteredData, setFilteredData] = useState(testData);

  // Function to handle search input changes
  const handleSearch = (value: string) => {
    setInputValue(value);

      // Filter the testData based on the search term "case insensitive match"
      const filtered = testData.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered); // Update the filtered data to be displayed
    };


  return (
    <div className={styles.page}>
      <div className={styles.title_container}>
        <ReactSVG src="images/logo.svg" className={styles.logo} />
        <h1 className={styles.title}>Starling Vox</h1>
      </div>
      <SearchInput onSearch={handleSearch} />

      <div className={styles.results_wrapper}>
        {filteredData.length > 0 ? (
          // Show list of filtered items
          <List data={filteredData} />
        ) : (
          // Show message if no matches
          <div className={styles.no_results}>No course found</div>
        )}
      </div>
    </div>
  );
}

