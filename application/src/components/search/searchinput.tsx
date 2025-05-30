import styles from "./searchinput.module.css";
import { FiSearch, FiX } from 'react-icons/fi';

// Functional component for the search input
const SearchInput = () => {
  return (
    <div className={styles.search_wrapper}>
      <FiSearch className={styles.icon_left} />  

      <input
        className={styles.search_input}
        placeholder="Enter course name..."
      />

      <FiX className={styles.icon_right} />
    </div>
  );
};


export default SearchInput;
