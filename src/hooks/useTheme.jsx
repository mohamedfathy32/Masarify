/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const THEME_KEY = "masarify_theme";
const FONT_SIZE_KEY = "masarify_font_size";

const defaultTheme = "dark"; // dark | light فقط
const defaultFontSize = "normal"; // small | normal | large

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || defaultTheme);
  const [fontSize, setFontSize] = useState(() => localStorage.getItem(FONT_SIZE_KEY) || defaultFontSize);

  // تطبيق المظهر على body
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // تطبيق حجم الخط على body
  useEffect(() => {
    document.documentElement.setAttribute("data-font-size", fontSize);
    localStorage.setItem(FONT_SIZE_KEY, fontSize);
  }, [fontSize]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export  function useTheme() {
  return useContext(ThemeContext);
} 