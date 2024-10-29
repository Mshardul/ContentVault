import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme')?.toLowerCase() || 'light');

  useEffect(() => {
    // Define theme class and clear existing theme classes
    const themeClass = `${theme}-theme`;
    document.body.classList.remove('light-theme', 'dark-theme', 'classic-theme', 'pastel-theme');
    document.body.classList.add(themeClass);

    // Store current theme in localStorage
    localStorage.setItem('theme', theme); 
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};