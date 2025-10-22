import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../context/ThemeContext';
import { FontContext } from '../context/FontContext';
import PageTitle from '../components/PageTitle';

const themes = ['classic', 'dark', 'light', 'pastel', 'green'];
// Add the new font options in the `fonts` array.
const fonts = ['Georgia', 'Merriweather', 'Times New Roman', 'Arial', 'Verdana', 'Palatino'];

const SettingsPage = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { font, setFont } = useContext(FontContext);

  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [selectedFont, setSelectedFont] = useState(font);

  useEffect(() => {
    // Default theme and Font
    setTheme(selectedTheme);
    setFont(selectedFont);

    // Save preferences to localStorage
    localStorage.setItem('theme', selectedTheme);
    localStorage.setItem('font', selectedFont);
  }, [selectedTheme, selectedFont, setTheme, setFont]);

  return (
    <div className="container mx-auto">
      <PageTitle title="Settings" />

      {/* Theme Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Theme</h3>
        <select
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value)}
          className="p-2 border rounded cv-input"
        >
          {themes.map((themeOption) => (
            <option key={themeOption} value={themeOption}>
              {themeOption}
            </option>
          ))}
        </select>
      </div>

      {/* Font Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Font</h3>
        <select
          value={selectedFont}
          onChange={(e) => setSelectedFont(e.target.value)}
          className="p-2 border rounded cv-input"
        >
          {fonts.map((fontOption) => (
            <option key={fontOption} value={fontOption}>
              {fontOption}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
};

export default SettingsPage;