import React, { useContext } from 'react';
import TagColorContext from '../context/TagColorContext';
import { AppContext } from '../context/AppContext';
import { darkenColor } from '../utils/colorUtils';

const TagListPage = () => {
  const { tags } = useContext(AppContext); // List of all tags with counts
  const tagColorMap = useContext(TagColorContext);
  console.log(tagColorMap);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Tags</h2>
      <div className="flex flex-wrap gap-4">
        {tagColorMap &&
          tags.map((tag, index) => {
            const tagColorClass = tagColorMap[tag.name] || 'bg-blue-500 text-white';
            console.log(tag.name, tagColorClass);
            return (
              <a
                key={index}
                href={`/tags/${tag.name}`}
                className={`rounded-full px-2 py-0.5 text-xs transition-colors shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-200 ease-in-out tag ${tagColorClass}`}
                style={{
                  '--hover-color': darkenColor(tagColorClass, 10),
                }}
              >
                <span>{tag.name}</span>
                <span className="ml-2 bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs font-semibold">
                  {tag.count}
                </span>
              </a>
              );
            })}
        {/* {tags.map((tag) => (
          <div
            key={tag.name}
            className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${tagColorMap[tag.name]}`}
            style={{ backgroundColor: tagColorMap[tag.name] || '#d1d5db', color: '#fff' }}
          >
            <span>{tag.name}</span>
            <span className="ml-2 bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs font-semibold">
              {tag.count}
            </span>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default TagListPage;
