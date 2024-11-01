import React, { createContext, useState, useEffect } from 'react';
import articlesData from '../data/tech_articles.json';

const LOCAL_STORAGE_KEYS = {
  THEME: 'app_theme',
  FONT: 'app_font',
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // default theme
  const [font, setFont] = useState('Georgia'); // default font
  const [tags, setTags] = useState([]);
  const [thumbnailCache, setThumbnailCache] = useState({});

  useEffect(() => {

    const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    const savedFont = localStorage.getItem(LOCAL_STORAGE_KEYS.FONT);

    if (savedTheme) setTheme(savedTheme);
    if (savedFont) setFont(savedFont);

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

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, newTheme);
  };

  const updateFont = (newFont) => {
    setFont(newFont);
    localStorage.setItem(LOCAL_STORAGE_KEYS.FONT, newFont);
  };

  return (
    <AppContext.Provider value={{ theme, font, updateTheme, updateFont, tags, thumbnailCache, setThumbnailCache }}>
      {children}
    </AppContext.Provider>
  );
};