import React, { createContext, useMemo, useContext } from 'react';
import { AppContext } from './AppContext';
import { tagColors } from '../config/colorsConfig';
import { shuffleArray } from '../utils/dataUtils';
import ThemeContext from './ThemeContext';

const TagColorContext = createContext();

const adjustBackgroundColor = (colorHex, theme) => {
  if (theme === 'light') return colorHex;
  return 'transparent';
}

const adjustBorderColor = (colorHex) => {
  return colorHex; // 'dark' uses the color directly
}

const adjustTextColor = (colorHex, theme) => {
  return theme === 'light' ? 'white' : colorHex;
}

export const TagColorProvider = ({ children }) => {
  const { tags } = useContext(AppContext);
  const { theme } = useContext(ThemeContext);

  // Generate a static base color map
  const baseColorMap = useMemo(() => {
    const shuffledColors = shuffleArray(tagColors);
    const colorMap = {};
    tags.forEach((tag, index) => {
      colorMap[tag.name] = shuffledColors[index % shuffledColors.length];
    });
    return colorMap;
  }, [tags]);

  // Adjust colors based on the theme without reshuffling
  const themedColorMap = useMemo(() => {
    const adjustedMap = {};
    Object.entries(baseColorMap).forEach(([tag, baseColorHex]) => {
      adjustedMap[tag] = {
        baseColorHex,
        backgroundColorHex: adjustBackgroundColor(baseColorHex, theme),
        borderColorHex: adjustBorderColor(baseColorHex),
        textColorHex: adjustTextColor(baseColorHex, theme),
      };
    });
    return adjustedMap;
  }, [theme, baseColorMap]);

  return (
    <TagColorContext.Provider value={themedColorMap}>
      {children}
    </TagColorContext.Provider>
  );
};

export default TagColorContext;