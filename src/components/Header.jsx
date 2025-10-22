import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import TagMultiSelect from "./TagMultiSelect";
import { FaTags, FaInfoCircle, FaCog, FaSun, FaMoon, FaPlusCircle } from "react-icons/fa";
import ThemeContext from "../context/ThemeContext";

const Header = () => {
  const { tags } = useContext(AppContext);
  const navigate = useNavigate();
  const { theme, setTheme } = useContext(ThemeContext);

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Function to handle search based on selected tags
  const handleSearch = (selectedTags) => {
    navigate("/tags/filter", { state: { selectedTagNames: selectedTags.map((tag) => tag.name) } });
  };

  // debug helper removed (not used)

  return (
    <header className="header flex items-center justify-between px-6 py-4 bg-white shadow-md">
      {/* Left Side: Logo and Search */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          ContentVault
          {/* <img src="path-to-logo.png" alt="Logo" className="h-8 w-8" /> */}
        </Link>

        {/* Search Component */}
        <div className="w-full max-w-md">
          <TagMultiSelect variant="search" allTags={tags} onSearch={handleSearch} overlay />
        </div>
      </div>

      {/* Right Side: Navigation Icons */}
      <div className="flex items-center space-x-2">
        {/* Theme Toggle Button */}
        <button
          onClick={handleThemeToggle}
          className="p-2 rounded-full focus:outline-none header-icon"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <FaMoon size={24} /> : <FaSun size={24} />}
        </button>

        {/* Tags */}
        <Link to="/tags/all" className="header-icon">
          <FaTags size={24} />
        </Link>

        {/* Add new Entry */}
        <Link to="/new" className="header-icon">
          <FaPlusCircle size={24} />
        </Link>

        {/* About Us */}
        <Link to="/about" className="header-icon">
          <FaInfoCircle size={24} />
        </Link>

        {/* Settings */}
        <Link to="/settings" className="header-icon">
          <FaCog size={24} />
        </Link>
      </div>
    </header>
  );
};

export default Header;
