import React, { useEffect, useState } from 'react';
import ArticleList from '../components/ArticleList';
import articlesData from '../data/articles.json'; 

const HomePage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Mimic an API call to fetch articles data
    setArticles(articlesData);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">All Articles</h1>
      <ArticleList articles={articles} />
    </div>
  );
};

export default HomePage;