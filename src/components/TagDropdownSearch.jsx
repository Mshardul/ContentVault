import React, { useState, useEffect, useCallback } from "react";
import { FaTimes, FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";

const TagDropdownSearch = ({ tags, onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const updateFilteredTags = useCallback(
    debounce((text) => {
      if (text.length >= 3) {
        setFilteredTags(
          tags.filter((tag) =>
            tag.name.toLowerCase().includes(text.toLowerCase())
          )
        );
      } else {
        setFilteredTags([]); // Clear filtered tags if less than 3 chars
      }
    }, 300),
    [tags]
  );

  // Update filtered tags whenever searchText changes
  useEffect(() => {
    updateFilteredTags(searchText);
    return () => updateFilteredTags.cancel(); // Clean up debounce on unmount
  }, [searchText, updateFilteredTags]);

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.some((selected) => selected.name === tag.name)) {
      setSelectedTags((prevTags) => [...prevTags, tag]);
    }
    setSearchText(""); // Clear the search text after selecting a tag
  };

  const handleTagRemove = (tagToRemove) => {
    setSelectedTags((prevTags) => prevTags.filter((tag) => tag.name !== tagToRemove.name));
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  // Trigger search action and pass selected tags to parent
  const handleSearchIconClick = () => {
    if (onSearch) {
      onSearch(selectedTags);
      setSearchText(""); 
      setFilteredTags([]);
    }
  };

  return (
    <div className="relative max-w-full w-full">
      {/* Search Input with Clear All and Search button */}
      <div className="flex items-center search-bar">
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
        <button
          onClick={handleSearchIconClick}
          className="px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FaSearch />
        </button>
      </div>

      {/* Dropdown with Selected Tags and Filtered Tags */}
      {(selectedTags.length > 0 || (searchText.length >= 3 && filteredTags.length > 0)) && (
        <div className="absolute mt-2 w-full bg-white border rounded shadow-lg z-10">
          {/* Display selected tags within the dropdown area */}
          <div className="p-2 flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag.name}
                className="bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs flex items-center"
              >
                {tag.name}
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
                    key={tag.name}
                    onClick={() => handleTagSelect(tag)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {tag.name} <span className="text-gray-500">({tag.count})</span>
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
