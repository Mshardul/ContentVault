import React, { useEffect, useState } from 'react';
import ArticleList from '../components/ArticleList';
import articlesData from '../data/articles.json'; 
import PageTitle from '../components/PageTitle';

const HomePage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Mimic an API call to fetch articles data
    setArticles(articlesData);
  }, []);

  return (
    <div className="container mx-auto">
      <PageTitle title="All Content" />
      <ArticleList articles={articles} />
    </div>
  );
};

export default HomePage;