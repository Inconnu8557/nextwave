import { createContext } from "react";

export type Theme = "light" | "dark" | "cyber";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);