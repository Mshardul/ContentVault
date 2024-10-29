import React, { createContext, useState, useEffect } from 'react';

export const FontContext = createContext();

export const FontProvider = ({ children }) => {
  const [font, setFont] = useState(localStorage.getItem('font') || 'Georgia');

  useEffect(() => {
    const fontClassName = font.toLowerCase().replace(/\s+/g, '-');
    document.body.className = document.body.className.replace(/\bfont-\S+/g, ''); // Remove previous font class
    document.body.classList.add(`font-${fontClassName}`);
  }, [font]);

  useEffect(() => {
    localStorage.setItem('font', font);
  }, [font]);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
};