// src/components/Layout.jsx

import React from 'react';
import Header from './Header';

const Layout = ({ children, tags, onSearch }) => {
  return (
    <div>
      <Header tags={tags} onSearch={onSearch} />
      <main className="p-6">{children}</main> {/* Main content area */}
    </div>
  );
};

export default Layout;