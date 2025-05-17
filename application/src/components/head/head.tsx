"use client";

import {
  ThemeContextWrapper,
  wrapContextInTheme,
} from "@/theme/theme.provider";

let context: ThemeContextWrapper | null = null;

const Head = () => {
  context = wrapContextInTheme();

  return (
    <head>
      <script src="scripts/setThemeBeforeHydration.js" />
    </head>
  );
};

export default Head;
export { context };
