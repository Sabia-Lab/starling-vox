"use client";
import { context } from "../head/head";

const Header = () => {
  return (
    <div>
      <button onClick={context!.toggleDarkMode}>Toggle Dark Mode</button>
      <button onClick={context!.toggleContrastMode}>
        Toggle High Contrast
      </button>
    </div>
  );
};

export default Header;
