import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import TagDropdownSearch from "./TagDropdownSearch";
import { FaTags, FaInfoCircle, FaCog, FaSun, FaMoon } from "react-icons/fa";
import { useThumbnailCache } from "../cache/ThumbnailCacheContext";
import { ThemeContext } from "../context/ThemeContext";

const Header = () => {
  const { tags, thumbnailCache } = useContext(AppContext);
  const navigate = useNavigate();
  const { cache } = useThumbnailCache();
  const { theme, setTheme } = useContext(ThemeContext);

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Function to handle search based on selected tags
  const handleSearch = (selectedTags) => {
    navigate("/tags/filter", { state: { selectedTagNames: selectedTags.map((tag) => tag.name) } });
  };

  const handlePrintCache = () => {
    console.log("Thumbnail Cache Data:", cache);
    console.log("thumbnailCache: ", JSON.stringify(thumbnailCache, null, 2));
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      {/* Left Side: Logo and Search */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600">
          ContentVault
          {/* <img src="path-to-logo.png" alt="Logo" className="h-8 w-8" /> */}
        </Link>

        {/* Search Component */}
        <div className="w-full max-w-md">
          <TagDropdownSearch tags={tags} onSearch={handleSearch} />
        </div>
      </div>

      {/* Right Side: Navigation Icons */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle Button */}
        <button
          onClick={handleThemeToggle}
          className="p-2 rounded-full text-gray-800 hover:text-gray-600 focus:outline-none"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <FaMoon size={24} /> : <FaSun size={24} />}
        </button>

        {/* Tags */}
        <Link to="/tags/all" className="text-gray-800 hover:text-gray-600">
          <FaTags size={30} />
        </Link>

        {/* About Us */}
        <Link to="/about" className="text-gray-800 hover:text-gray-600">
          <FaInfoCircle size={30} />
        </Link>

        {/* Settings */}
        <Link to="/settings" className="text-gray-700 hover:text-gray-500">
          <FaCog size={30} />
        </Link>
      </div>
    </header>
  );
};

export default Header;
