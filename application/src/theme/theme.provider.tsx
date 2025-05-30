"use client";
// prettier-ignore
import { 
  createContext, 
  useContext, 
  useEffect, 
  useMemo, 
  useState 
} from "react";

const LOCALSTORAGE_THEME_KEY = "theme";
const DATA_THEME_ATTRIBUTE = "data-theme";

const THEME_LIGHT = "light";
const THEME_LIGHT_HIGH_CONTRAST = "light-hc";
const THEME_DARK = "dark";
const THEME_DARK_HIGH_CONTRAST = "dark-hc";

type ThemeState =
  | typeof THEME_LIGHT
  | typeof THEME_LIGHT_HIGH_CONTRAST
  | typeof THEME_DARK
  | typeof THEME_DARK_HIGH_CONTRAST;

type ThemeContextWrapper = {
  isDark: boolean;
  isHighContrast: boolean;
  toggleDarkMode: () => void;
  toggleContrastMode: () => void;
};

const themeContext = createContext<ThemeContextWrapper>({
  isDark: false,
  isHighContrast: false,
  toggleDarkMode: () => {},
  toggleContrastMode: () => {},
});

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeState>(THEME_LIGHT);

  const isDark = useMemo(
    () => theme === THEME_DARK || theme === THEME_DARK_HIGH_CONTRAST,
    [theme]
  );

  const isHighContrast = useMemo(
    () =>
      theme === THEME_LIGHT_HIGH_CONTRAST || theme === THEME_DARK_HIGH_CONTRAST,
    [theme]
  );

  // No theme specified, check localstorage
  useEffect(() => {
    const storedTheme = localStorage.getItem(LOCALSTORAGE_THEME_KEY);

    if (storedTheme) {
      setTheme(storedTheme as ThemeState);
    } else {
      setTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? THEME_DARK
          : THEME_LIGHT
      );
    }
  }, []);

  // Update the theme on the document and in localstorage
  useEffect(() => {
    document.documentElement.setAttribute(DATA_THEME_ATTRIBUTE, theme);
    localStorage.setItem(LOCALSTORAGE_THEME_KEY, theme);
  }, [theme]);

  const toggleDarkMode = () => {
    setTheme((prev) => {
      switch (prev) {
        case THEME_LIGHT:
          return THEME_DARK;
        case THEME_DARK:
          return THEME_LIGHT;
        case THEME_LIGHT_HIGH_CONTRAST:
          return THEME_DARK_HIGH_CONTRAST;
        case THEME_DARK_HIGH_CONTRAST:
          return THEME_LIGHT_HIGH_CONTRAST;
        default:
          return THEME_LIGHT;
      }
    });
  };

  const toggleContrastMode = () => {
    setTheme((prev) => {
      switch (prev) {
        case THEME_LIGHT:
          return THEME_LIGHT_HIGH_CONTRAST;
        case THEME_DARK:
          return THEME_DARK_HIGH_CONTRAST;
        case THEME_LIGHT_HIGH_CONTRAST:
          return THEME_LIGHT;
        case THEME_DARK_HIGH_CONTRAST:
          return THEME_DARK;
        default:
          return THEME_LIGHT;
      }
    });
  };

  // prettier-ignore
  return (
    <themeContext.Provider value={{ isDark, 
        isHighContrast, toggleDarkMode, toggleContrastMode }}>
      {children}
    </themeContext.Provider>
  );
};

const useTheme = () => useContext(themeContext);

/**
 * Retrieve CSS color for use in JS libraries.
 *
 * *Usage:*
 *
 * `evaluateColor("primary")` returns the CSS value of property `--color-primary`
 *
 * `evaluateColor("secondary-container")` returns the CSS value of property
 * `--color-secondary-container`
 *
 * @param name Name of the color
 * @returns CSS compliant color string (rgba, rgb, hex or alias)
 */
const evaluateColor = (name: String): String | undefined => {
  if (typeof window !== "undefined") {
    const colorValue = getComputedStyle(document.documentElement)
      .getPropertyValue(`--color-${name}`)
      .trim();

    if (colorValue) {
      return colorValue;
    } else {
      console.error(`--color-${name} not found.`);
    }
  } else {
    console.error("evaluateColor(String) can only run on a client.");
  }

  return undefined;
};

export { useTheme, evaluateColor };
export type { ThemeContextWrapper };
export default ThemeWrapper;
