"use client";
import { ThemeContextWrapper, useTheme } from "@/theme/theme.provider";
import style from "./header.module.css";
import { ReactSVG } from "react-svg";

const Header = () => {
  const context: ThemeContextWrapper = useTheme();

  return (
    <div className={style.container}>
      <button className={style.button} onClick={context!.toggleDarkMode}>
        <ReactSVG
          src={
            context.isDark
              ? "images/header/light_mode.svg"
              : "images/header/dark_mode.svg"
          }
        />
      </button>
      <button className={style.button} onClick={context!.toggleContrastMode}>
        <ReactSVG
          src={
            context.isHighContrast
              ? "images/header/contrast_normal.svg"
              : "images/header/contrast_high.svg"
          }
        />
      </button>
    </div>
  );
};

export default Header;
