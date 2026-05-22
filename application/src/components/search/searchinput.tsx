"use client";
import styles from "./searchinput.module.css";
import { FiSearch, FiX } from "react-icons/fi";
import { useState } from "react";

type SearchInputProps = {
  onSearch: (value: string) => void;  // A callback function to pass the input value back to the parent.
};

const SearchInput = ({ onSearch }: SearchInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const clearSearch = () => {
    setInputValue("");  // Clear the input field
    onSearch("");      // Notify the parent component with an empty string
  };


  return (
    <div className={styles.search_wrapper}>
      <FiSearch className={styles.icon_left} />
      <input
        className={styles.search_input}
        type="text"
        placeholder="Enter course name..."
        value={inputValue}
        onChange={(e) => {
          const newValue = e.target.value;
          setInputValue(newValue);
          onSearch(newValue); // Live search while typing
        }}
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

