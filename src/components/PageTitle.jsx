// src/components/PageTitle.jsx
import React from 'react';

const PageTitle = ({ title }) => {
  return (
    <div className="bg-gray-100 py-4 shadow-sm mb-6 page-title">
      <h1 className="text-3xl font-semibold text-center page-title-text">{title}</h1>
    </div>
  );
};

export default PageTitle;
