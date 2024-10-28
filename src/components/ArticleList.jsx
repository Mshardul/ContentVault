// ArticleList.jsx

import React from 'react';
import Masonry from 'react-masonry-css';
import ArticleCard from './ArticleCard';

// Breakpoints for Masonry layout
const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1
};

const ArticleList = ({ articles }) => {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex -ml-4 w-auto" // Masonry styles
      columnClassName="pl-4 bg-clip-padding" // Styles for individual columns
    >
      {articles.map((article) => (
        <ArticleCard key={article.url} {...article} />
      ))}
    </Masonry>
  );
};

export default ArticleList;