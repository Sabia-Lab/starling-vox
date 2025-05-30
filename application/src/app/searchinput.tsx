"use client";

import styles from "./searchinput.module.css";
import { FiSearch, FiX } from "react-icons/fi";
import { useState, ChangeEvent } from "react";

const SearchInput = () => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const clearSearch = () => {
    setInputValue("");
  };

  return (
    <div className={styles.search_wrapper}>
      <FiSearch className={styles.icon_left} />
      <input
        className={styles.search_input}
        type="text"
        placeholder="Enter course name..."
        value={inputValue}
        onChange={handleChange}
      />
      {inputValue && (
        <FiX
          className={styles.icon_right}
          onClick={clearSearch}
        />
      )}
    </div>
  );
};

export default SearchInput;

