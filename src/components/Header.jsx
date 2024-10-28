import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import TagDropdownSearch from "./TagDropdownSearch";

const Header = ({ onSearch }) => {
  const { tags } = useContext(AppContext);
  const [selectedTags, setSelectedTags] = useState([]);

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  // Function to trigger search based on selected tags
  const handleSearch = () => {
    if (onSearch) {
      onSearch(selectedTags);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold text-gray-800 hover:text-gray-600"
      >
        ContentVault
      </Link>

      {/* Tag Dropdown Search */}
      <div className="flex items-center space-x-2">
        {/* Tag Dropdown Search */}
        <TagDropdownSearch
          tags={tags}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          className="flex-1 h-10 p-2 border border-gray-300 rounded-md"
        />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="h-10 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 flex items-center"
        >
          <FaSearch className="mr-2" />
          Search
        </button>
      </div>

      {/* About Us */}
      <Link to="/about" className="text-gray-700 hover:text-gray-500">
        About Us
      </Link>
    </header>
  );
};

export default Header;
