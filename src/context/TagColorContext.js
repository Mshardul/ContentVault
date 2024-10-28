import React, { createContext, useMemo, useContext } from 'react';
import { AppContext } from './AppContext';
import { tagColors } from '../config/colors';
import { shuffleArray } from '../utils/dataUtils';

const TagColorContext = createContext();

export const TagColorProvider = ({ children }) => {
  const { tags } = useContext(AppContext);

  // Use useMemo to calculate tagColorMap only when tags change
  const tagColorMap = useMemo(() => {
    const shuffledColors = shuffleArray(tagColors);
    const colorMap = {};
    tags.forEach((tag, index) => {
      colorMap[tag.name] = shuffledColors[index % shuffledColors.length];
    });
    console.log("Generated tagColorMap:", colorMap); // Log the color map
    return colorMap;
  }, [tags]);

  return (
    <TagColorContext.Provider value={tagColorMap}>
      {children}
    </TagColorContext.Provider>
  );
};

export default TagColorContext;
