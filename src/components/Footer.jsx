import React from 'react';
import { Link } from "react-router-dom";

const Footer = () => (
  // <footer className="w-full bg-gray-100 p-4 mt-6 text-center border-t border-gray-300 footer">
  <footer className="header flex items-center justify-between px-6 py-4 bg-white shadow-md">
    <div className="text-sm text-gray-700">
      © 2024 ContentVault
    </div>
    <div className="flex justify-center space-x-4 mt-2">
      <Link to="/about" className="footer-link">About Us</Link>
      <Link to="/privacy" className="footer-link">Privacy Policy</Link>
      <Link to="/contact" className="footer-link">Contact Us</Link>
    </div>
  </footer>
);

export default Footer;