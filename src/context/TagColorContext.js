import React, { createContext, useMemo, useContext } from 'react';
import { AppContext } from './AppContext';
import { tagColors } from '../config/colorsConfig';
import { shuffleArray } from '../utils/dataUtils';
import { ThemeContext } from './ThemeContext';

const TagColorContext = createContext();

const getBackgroundColorHex = (colorHex, theme) => {
  if (theme === 'light') return colorHex;
  return 'white'
}

const getBorderColorHex = (colorHex, theme) => {
  if (theme === 'light') return '';
  return colorHex;
}

const getTextColorHex = (colorHex, theme) => {
  if (theme === 'light') return 'white';
  return colorHex;
}

export const TagColorProvider = ({ children }) => {
  const { tags } = useContext(AppContext);
  const { theme } = useContext(ThemeContext);

  // Use useMemo to calculate tagColorMap only when tags change
  const tagColorMap = useMemo(() => {
    console.log("theme", theme);
    const shuffledColors = shuffleArray(tagColors);
    const colorMap = {};
    tags.forEach((tag, index) => {
      const baseColorHex = shuffledColors[index % shuffledColors.length];
      colorMap[tag.name] = {
        baseColorHex: baseColorHex,
        backgroundColorHex: getBackgroundColorHex(baseColorHex, theme),
        borderColorHex: getBorderColorHex(baseColorHex, theme),
        textColorHex: getTextColorHex(baseColorHex, theme),
      };
    });
    return colorMap;
  }, [tags, theme]);

  return (
    <TagColorContext.Provider value={tagColorMap}>
      {children}
    </TagColorContext.Provider>
  );
};

export default TagColorContext;
