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

  // Handle pressing the Enter key to trigger search
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      onSearch(inputValue);  // Trigger the search with the current input value
    }
  };


  return (
    <div className={styles.search_wrapper}>
      <FiSearch className={styles.icon_left} />
      <input
        className = {styles.search_input}
        type = "text"
        placeholder = "Enter course name..."
        value = {inputValue}
        onKeyDown={handleKeyPress}
        onChange = {(e) => setInputValue(e.target.value)}
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

