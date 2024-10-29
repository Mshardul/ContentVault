import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import TagDropdownSearch from "./TagDropdownSearch";
import { FaTags, FaInfoCircle } from "react-icons/fa";

const Header = () => {
  const { tags } = useContext(AppContext);
  const navigate = useNavigate();

  // Function to handle search based on selected tags
  const handleSearch = (selectedTags) => {
    navigate("/tags/filter", { state: { selectedTagNames: selectedTags.map((tag) => tag.name) } });
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
        {/* Tags */}
        <Link to="/tags/all" className="text-gray-800 hover:text-gray-600">
          <FaTags size={30} />
        </Link>

        {/* About Us */}
        <Link to="/about" className="text-gray-800 hover:text-gray-600">
          <FaInfoCircle size={30} />
        </Link>
      </div>
    </header>
  );
};

export default Header;
