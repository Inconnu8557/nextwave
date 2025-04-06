import { useContext } from "react";
import { ThemeContext, ThemeContextType } from "../context/themeContextDef";

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};