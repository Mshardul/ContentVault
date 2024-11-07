import React, { useCallback, useEffect, useRef, useState } from 'react';
import ArticleList from '../components/ArticleList';
import articlesData from '../data/tech_articles.json'; 
import PageTitle from '../components/PageTitle';

const BATCH_SIZE = 10; // Number of articles to load per scroll

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  // Function to load the next set of articles
  const loadMoreArticles = useCallback(async () => {
    console.log("loading more articles");
    if (!hasMore || loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    setTimeout(() => {
      const startIndex = (page - 1) * BATCH_SIZE;
      const newArticles = articlesData.slice(startIndex, startIndex + BATCH_SIZE);
      console.log("startIndex: ", startIndex);
      console.log("newArticles: ", newArticles.length, newArticles,);

      if (newArticles.length > 0) {
        setArticles((prevArticles) => [...prevArticles, ...newArticles]);
      }

      if (newArticles.length < BATCH_SIZE) {
        setHasMore(false);
      }

      setLoading(false);
      loadingRef.current = false;
    }, 500);
  }, [page, hasMore]);

  // Initial load of articles and load more when `page` changes
  useEffect(() => {
    loadMoreArticles();
  }, [loadMoreArticles]);

  // Scroll event listener to detect if user is near bottom
  useEffect(() => {
    let scrollingTimeout;

    const handleScroll = () => {
      if (scrollingTimeout) clearTimeout(scrollingTimeout);
      scrollingTimeout = setTimeout(() => {
        if (
          window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight * 0.9
        ) {
          setPage((prevPage) => prevPage + 1);
        }
      }, 200);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollingTimeout) clearTimeout(scrollingTimeout);
    };
  }, []);

  return (
    <div className="container mx-auto">
      <PageTitle title="All Content" />
      <ArticleList articles={articles} />
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-white text-lg font-semibold">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default HomePage;