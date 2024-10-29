import React, { createContext, useState, useEffect } from 'react';
import { themeConfig } from '../config/themeConfig';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme')?.toLowerCase() || 'light');

  // useEffect(() => {
  //   // Define theme class and clear existing theme classes
  //   const themeClass = `${theme}-theme`;
  //   document.body.classList.remove('light-theme', 'dark-theme', 'classic-theme', 'pastel-theme');
  //   document.body.classList.add(themeClass);

  //   // Store current theme in localStorage
  //   localStorage.setItem('theme', theme); 
  // }, [theme]);

  useEffect(() => {
    const selectedTheme = themeConfig[theme];

    // Apply CSS variables for the selected theme
    Object.keys(selectedTheme).forEach((key) => {
      document.documentElement.style.setProperty(`--${key}`, selectedTheme[key]);
    });

    localStorage.setItem('theme', theme); // Persist the theme selection
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};