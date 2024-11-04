import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TagColorContext from '../context/TagColorContext';

const TagsList = ({ size = "sm", selectedTags = [] }) => {
  const navigate = useNavigate();
  const tagColorMap = useContext(TagColorContext);

  const sizeConfig = {
    sm: {
      rootFlexClass: "flex flex-wrap gap-2 py-2",
      tagSizeClass: "px-2 py-0.5 text-xs",
    },
    md: {
      rootFlexClass: "flex flex-wrap gap-3 py-3",
      tagSizeClass: "px-3 py-1 text-sm",
      tagHoverClass: "hover:shadow-lg hover:scale-105",
    },
    lg: {
      rootFlexClass: "flex flex-wrap gap-4 py-4",
      tagSizeClass: "px-4 py-2 text-base",
      tagHoverClass: "hover:shadow-xl hover:scale-105",
    },
  };

  // Select the config based on the provided size
  const config = sizeConfig[size] || sizeConfig.sm;

  return (
    <div className={`${config.rootFlexClass}`}>
      {tagColorMap &&
        selectedTags.map((tag, index) => {
          const { backgroundColorHex, borderColorHex, textColorHex } = tagColorMap[tag.name] || {};

          return (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/tags/filter`, { state: { selectedTagNames: [tag.name] } });
              }}
              className={`tag ${config.tagSizeClass} ${config.tagHoverClass} flex items-center`}
              style={{
                backgroundColor: backgroundColorHex,
                borderColor: borderColorHex,
                color: textColorHex,
                borderRadius: '999px',
              }}
            >
              <span>{tag.name}</span>
              {tag.count > 0 && (
                <span 
                  className="ml-2 bg-gray-200 text-gray-800 rounded-full px-1.5 py-0.5 text-xs font-normal flex items-center justify-center"
                  style={{ 
                    fontSize: '0.75rem', 
                    height: '1.2rem',    // Fixed height for consistent alignment
                    minWidth: '1.2rem',  // Fixed width for consistent centering
                    padding: '0 0.4rem', // Horizontal padding for spacing
                    fontWeight: 'normal', 
                    lineHeight: '1',     // Line height of 1 for precise alignment
                    textAlign: 'center'  // Center-align text within the badge
                  }}
                >
                  {tag.count}
                </span>
              )}
            </button>
          );
        })
      }
    </div>
  );
};

export default TagsList;
