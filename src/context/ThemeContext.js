import React, { createContext, useState, useEffect } from 'react';
import { themeConfig } from '../config/themeConfig';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme')?.toLowerCase() || 'light');

  useEffect(() => {
    const selectedTheme = themeConfig[theme];

    // Apply each theme color as a CSS variable
    Object.keys(selectedTheme).forEach((key) => {
      document.documentElement.style.setProperty(`--${key}`, selectedTheme[key]);
    });

    // Persist theme selection in localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;