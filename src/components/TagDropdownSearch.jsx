import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const TagDropdownSearch = ({ tags }) => {
  const [searchText, setSearchText] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Update filtered tags whenever searchText changes
  useEffect(() => {
    if (searchText.length >= 3) {
      setFilteredTags(
        tags.filter((tag) =>
          tag.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else {
      setFilteredTags([]); // Clear filtered tags if less than 3 chars
    }
  }, [searchText, tags]);

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setSearchText(""); // Clear the search text after selecting a tag
  };

  const handleTagRemove = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  return (
    <div className="relative max-w-full w-full">
      {/* Search Input with Clear All button */}
      <div className="flex items-center border border-gray-300 rounded-md">
        <input
          type="text"
          value={searchText}
          onChange={handleInputChange}
          placeholder="Select tags..."
          className="w-full px-4 py-2 focus:outline-none focus:ring"
        />
        {selectedTags.length > 0 && (
          <button
            onClick={clearAllTags}
            className="px-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Dropdown with Selected Tags and Filtered Tags */}
      {(selectedTags.length > 0 || (searchText.length >= 3 && filteredTags.length > 0)) && (
        <div className="absolute mt-2 w-full bg-white border rounded shadow-lg z-10">
          {/* Display selected tags within the dropdown area */}
          <div className="p-2 flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs flex items-center"
              >
                {tag}
                <button
                  onClick={() => handleTagRemove(tag)}
                  className="ml-2 text-white"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          {/* Display filtered tags based on search input */}
          {searchText.length >= 3 && (
            <div className="border-t border-gray-200">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <div
                    key={tag}
                    onClick={() => handleTagSelect(tag)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {tag}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 px-4 py-2">No tags found</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagDropdownSearch;