// React Imports
import React, { useEffect, useState } from "react";

// External Library Imports
import { useLocation } from 'react-router-dom';

// Internal Project Imports
import ArticleList from '../components/ArticleList';
import articlesData from '../data/tech_articles.json';
import PageTitle from '../components/PageTitle';
import TagsList from '../components/TagsList';

const TagContentPage = () => {
  const location = useLocation();
  const { selectedTagNames } = location.state || [];
  const [selectedTags, setSelectedTags] = useState([]);

  // Filter articles based on the union of selected tags
  const filteredArticles = articlesData.filter((article) =>
    article.tags.some((tag) => selectedTagNames.includes(tag))
  );

  useEffect(() => {
    setSelectedTags(selectedTagNames.map(tagName => {return {name: tagName, count: 0}}));
  }, [selectedTagNames]);

  return (
    <div className="container mx-auto">
      <PageTitle title={`Firtered Content`} />
      <TagsList size={"md"} selectedTags={selectedTags} />
      <br/>
      <ArticleList articles={filteredArticles} />
    </div>
  );
};

export default TagContentPage;