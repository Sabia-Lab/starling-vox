(() => {
  try {
    const storage = window.localStorage;

    if (typeof storage?.getItem !== "function") {
      return;
    }

    const storedTheme = storage.getItem("theme");

    if (storedTheme) {
      document.documentElement.setAttribute("data-theme", storedTheme);
    }
  } catch {
    // Storage can be unavailable in private browsing or restricted environments.
  }
})();
