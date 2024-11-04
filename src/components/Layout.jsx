// src/components/Layout.jsx

import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, tags, onSearch }) => {
  return (
    <div>
      <Header tags={tags} onSearch={onSearch} />
      <main className="p-6">{children}</main> {/* Main content area */}
      <Footer />
    </div>
  );
};

export default Layout;