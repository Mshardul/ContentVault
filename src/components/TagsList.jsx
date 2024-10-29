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
          console.log(tag, backgroundColorHex, borderColorHex, textColorHex);
          return (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/tags/filter`, { state: { selectedTagNames: [tag.name] } });
              }}
              className={`rounded-full tag ${config.tagSizeClass} ${config.tagHoverClass}`}
              style={{
                backgroundColor: backgroundColorHex,
                borderColor: borderColorHex,
                color: textColorHex,
              }}
            >
              <span>{tag.name}</span>
              {tag.count > 0 && (
                <span className="ml-2 bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs font-semibold">
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