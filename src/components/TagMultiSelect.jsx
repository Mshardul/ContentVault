import React, { useState, useEffect, useMemo, useRef } from "react";
import { FaTimes, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import debounce from "lodash.debounce";

/**
 * A flexible multi-select component for handling tags in two modes:
 * 1. 'search': For filtering/searching posts with selected tags (requires a search button).
 * 2. 'add': For adding new tags to a post (allows creating new tags on Enter).
 *
 * @param {string} variant - 'search' or 'add'.
 * @param {Array<Object | string>} allTags - Array of all available tags.
 * - 'search' variant expects: Array<{name: string, count: number}>
 * - 'add' variant expects: Array<string>
 * @param {Array<Object | string>} initialSelectedTags - Tags that are already selected.
 * @param {function} onTagsChange - Callback for when selected tags change (used in 'add' variant).
 * @param {function} onSearch - Callback to trigger the search action (used in 'search' variant).
 */
const TagMultiSelect = ({
  variant,
  allTags,
  initialSelectedTags = [],
  onTagsChange,
  onSearch,
  overlay = false,
  closeOnSelect = false,
}) => {
  const isSearchVariant = variant === "search";

  // State to hold the currently selected tags.
  const [selectedTags, setSelectedTags] = useState(() => {
    return initialSelectedTags.map(tag => 
      typeof tag === 'string' ? { name: tag } : tag
    );
  });
  
  const [searchText, setSearchText] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  
  // Tag name extraction for use in filtering and selection logic
  const selectedTagNames = useMemo(() => selectedTags.map(tag => tag.name.toLowerCase()), [selectedTags]);

  // Unified debounced function for filtering tags (useMemo to satisfy lint)
  const updateFilteredTags = useMemo(() => {
    const delay = isSearchVariant ? 300 : 100;
    return debounce((text) => {
      const minLength = isSearchVariant ? 3 : 0; // Search needs 3 chars, Add starts suggesting immediately

      if (text.length >= minLength) {
        setFilteredTags(
          (allTags || []).filter((tag) => {
            const tagName = isSearchVariant ? tag.name : tag;
            return (
              tagName.toLowerCase().includes(text.toLowerCase()) &&
              !selectedTagNames.includes(tagName.toLowerCase())
            );
          }).slice(0, 10) // Limit suggestions to a reasonable number
        );
      } else {
        setFilteredTags([]);
      }
    }, delay);
  }, [allTags, isSearchVariant, selectedTagNames]);

  // Update filtered tags whenever searchText or selected tags change
  useEffect(() => {
    updateFilteredTags(searchText);
    return () => updateFilteredTags.cancel(); // Clean up debounce on unmount
  }, [searchText, updateFilteredTags, selectedTags]);

  // Click outside & Escape handler to close dropdown
  useEffect(() => {
    const onDocumentClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', onDocumentClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocumentClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  // Notify parent of changes in 'add' variant
  useEffect(() => {
    if (!isSearchVariant && onTagsChange) {
      // Return tags as simple strings for the 'add' variant
      onTagsChange(selectedTags.map(tag => tag.name));
    }
  }, [selectedTags, isSearchVariant, onTagsChange]);

  // --- Handlers ---

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    setIsOpen(true);
  };

  const handleTagSelect = (tag) => {
    const newTag = typeof tag === 'string' ? { name: tag } : tag;

    if (!selectedTagNames.includes(newTag.name.toLowerCase())) {
      setSelectedTags((prevTags) => [...prevTags, newTag]);
    }
    setSearchText(""); // Clear search/input text
    setFilteredTags([]);

    if (closeOnSelect) {
      setIsOpen(false);
    } else {
      // keep focus for quick additional selections
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setSelectedTags((prevTags) =>
      prevTags.filter((tag) => tag.name !== tagToRemove.name)
    );
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  // Logic for handling 'Enter' key press in 'add' variant
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedText = searchText.trim();
      
      if (!isSearchVariant && trimmedText.length > 0) {
        const isAlreadySelected = selectedTagNames.includes(trimmedText.toLowerCase());

        if (filteredTags.length === 1) {
          // If only 1 suggestion, select it
          const tagToSelect = filteredTags[0];
          handleTagSelect(isSearchVariant ? tagToSelect : tagToSelect.name || tagToSelect);
        } else if (!isAlreadySelected) {
          // Create new tag if not already selected (only in 'add' variant)
          handleTagSelect({ name: trimmedText });
        }
      } 
      
      // Clear suggestions after attempting to add/select
      setFilteredTags([]);
      setSearchText("");
    }
    else if (e.key === 'Backspace' && !searchText) {
      // remove last tag when input is empty
      setSelectedTags((prev) => prev.slice(0, Math.max(0, prev.length - 1)));
    }
  };

  

  const handleSearchIconClick = () => {
    if (isSearchVariant && onSearch) {
      onSearch(selectedTags);
      setSearchText("");
      setFilteredTags([]);
    }
  };

  // --- Rendering ---

  // Determine if the dropdown should be visible (requires isOpen)
  const canShowDropdown = isSearchVariant
    ? selectedTags.length > 0 || (searchText.length >= 3 && filteredTags.length > 0)
    : (searchText.length > 0 && (filteredTags.length > 0 || !selectedTagNames.includes(searchText.trim().toLowerCase())));

  const showDropdown = isOpen && canShowDropdown;

  const placeholderText = isSearchVariant ? "Select tags to search..." : "Enter or select tags...";

  return (
    <div ref={containerRef} className={`tag-multiselect ${overlay ? "tag-multiselect--overlay" : ""}`}>
      <div className="tag-multiselect__control search-bar">
        <div className="tag-multiselect__chips" onClick={() => { setIsOpen(true); inputRef.current && inputRef.current.focus(); }}>
          {selectedTags.map((tag) => (
            <span key={tag.name} className="tag-multiselect__chip">
              {tag.name}
              <button onClick={(e) => { e.stopPropagation(); handleTagRemove(tag); }} className="tag-multiselect__chip-remove" title={`Remove ${tag.name}`}>
                &times;
              </button>
            </span>
          ))}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchText}
          onChange={handleInputChange}
          onKeyDown={!isSearchVariant ? handleKeyDown : handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={selectedTags.length === 0 ? placeholderText : placeholderText}
          className="tag-multiselect__input"
        />

        {/* Clear input text */}
        {searchText.length > 0 && (
          <button title="Clear input" onClick={(e) => { e.stopPropagation(); setSearchText(""); setFilteredTags([]); inputRef.current && inputRef.current.focus(); }} className="tag-multiselect__button">
            <FaTimes />
          </button>
        )}

        {isSearchVariant && (
          <button title="Search" onClick={(e) => { e.stopPropagation(); handleSearchIconClick(); }} className="tag-multiselect__button">
            <FaSearch />
          </button>
        )}

        <button title="Toggle" onClick={(e) => { e.stopPropagation(); setIsOpen((v) => !v); }} className="tag-multiselect__toggle">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* Dropdown with Selected Tags and Filtered Tags */}
      {showDropdown && (
        <div className="tag-multiselect__dropdown">
          {/* Display selected tags within the dropdown area (with clear all) */}
          <div className="tag-multiselect__selected">
            <div className="tag-multiselect__selected-list">
              {selectedTags.map((tag) => (
                <span key={tag.name} className="tag-multiselect__tag">
                  {tag.name}
                  <button onClick={() => handleTagRemove(tag)} className="tag-multiselect__tag-remove" title={`Remove ${tag.name}`}>
                    &times;
                  </button>
                </span>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <button onClick={clearAllTags} className="tag-multiselect__clear-all">Clear all</button>
            )}
          </div>

          {/* Display filtered tags based on search input */}
          <div className="tag-multiselect__list">
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => {
                const tagName = isSearchVariant ? tag.name : tag;
                const tagCount = isSearchVariant ? tag.count : null;
                return (
                  <div key={tagName} onClick={() => handleTagSelect(tag)} className="tag-multiselect__item">
                    <span className="tag-multiselect__item-name">{tagName}</span>
                    {tagCount !== null && (<span className="tag-multiselect__item-count">({tagCount})</span>)}
                  </div>
                );
              })
            ) : (
                // Option to create a new tag in 'add' mode
                (!isSearchVariant && searchText.trim().length > 0 && !selectedTagNames.includes(searchText.trim().toLowerCase())) && (
                  <div onClick={() => handleTagSelect({ name: searchText.trim() })} className="tag-multiselect__create">
                    + Create new tag: <strong>{searchText.trim()}</strong>
                  </div>
                )
            )}
            
            {/* Show no tags found message if needed */}
            {(isSearchVariant && searchText.length >= 3 && filteredTags.length === 0) && (
              <p className="tag-multiselect__empty">No tags found matching search.</p>
            )}
          </div>
        </div>
      )}
      
      {/* Display selected tags below the input for the 'add' variant for better visibility */}
      {/* {!isSearchVariant && selectedTags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
                <span
                    key={tag.name}
                    className="bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs flex items-center"
                >
                    {tag.name}
                    <button
                        onClick={() => handleTagRemove(tag)}
                        className="ml-2 text-white opacity-75 hover:opacity-100"
                        title={`Remove ${tag.name}`}
                    >
                        &times;
                    </button>
                </span>
            ))}
        </div>
      )} */}
    </div>
  );
};

export default TagMultiSelect;