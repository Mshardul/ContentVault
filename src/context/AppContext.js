import React, { createContext, useState, useEffect } from 'react';
import articlesData from '../data/articles.json';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [tags, setTags] = useState([]);
  const [thumbnailCache, setThumbnailCache] = useState({});

  useEffect(() => {
    // Initialize tags from articles data with counts
    const tagCounts = {};

    articlesData.forEach((article) => {
      article.tags.forEach((tag) => {
        if (tagCounts[tag]) {
          tagCounts[tag] += 1;
        } else {
          tagCounts[tag] = 1;
        }
      });
    });

    // Convert tagCounts object to an array of { name, count } objects
    const tagsArray = Object.entries(tagCounts).map(([name, count]) => ({ name, count }));
    setTags(tagsArray);

    // Initialize thumbnail cache with existing thumbnails
    const initialCache = {};
    articlesData.forEach((article) => {
      if (article.url && article.thumbnailUrl) {
        initialCache[article.url] = article.thumbnailUrl;
      }
    });
    setThumbnailCache(initialCache);
  }, []);

  return (
    <AppContext.Provider value={{ tags, thumbnailCache, setThumbnailCache }}>
      {children}
    </AppContext.Provider>
  );
};