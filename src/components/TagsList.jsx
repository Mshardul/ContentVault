import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TagColorContext from '../context/TagColorContext';
import { darkenColor } from '../utils/colorUtils';

const TagsList = ({ size = "sm", selectedTags = [] }) => {
  const navigate = useNavigate();
  const tagColorMap = useContext(TagColorContext);

  const sizeConfig = {
    sm: {
      rootFlexClass: "flex flex-wrap gap-2 p-2",
      tagSizeClass: "px-2 py-0.5 text-xs",
      tagTransformClass: "transform transition-transform transition-colors duration-200 ease-in-out",
      tagShadowClass: "shadow-sm",
    },
    md: {
      rootFlexClass: "flex flex-wrap gap-3 p-3",
      tagSizeClass: "px-3 py-1 text-sm",
      tagHoverClass: "hover:shadow-lg hover:scale-105",
      tagTransformClass: "transform transition-transform transition-colors duration-200 ease-in-out",
      tagShadowClass: "shadow-md",
    },
    lg: {
      rootFlexClass: "flex flex-wrap gap-4 p-4",
      tagSizeClass: "px-4 py-2 text-base",
      tagHoverClass: "hover:shadow-xl hover:scale-105",
      tagTransformClass: "transform transition-transform transition-colors duration-200 ease-in-out",
      tagShadowClass: "shadow-lg",
    },
  };

  // Select the config based on the provided size
  const config = sizeConfig[size] || sizeConfig.sm;

  return (
    <div className={`${config.rootFlexClass}`}>
      {tagColorMap &&
        selectedTags.map((tag, index) => {
          const tagColorClass = tagColorMap[tag.name] || 'bg-blue-500 text-white';
          return (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/tags/filter`, { state: { selectedTagNames: [tag.name] } });
              }}
              className={`rounded-full tag ${config.tagSizeClass} ${config.tagHoverClass} ${config.tagTransformClass} ${config.tagShadowClass} ${tagColorClass}`}
              style={{
                '--hover-color': darkenColor(tagColorClass, 10),
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