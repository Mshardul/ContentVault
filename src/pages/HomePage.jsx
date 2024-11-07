import React, { useCallback, useEffect, useRef, useState } from 'react';
import ArticleList from '../components/ArticleList';
import articlesData from '../data/tech_articles.json'; 
import PageTitle from '../components/PageTitle';

const BATCH_SIZE = 10; // Number of articles to load per click

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Function to load the next set of articles based on the current page
  const loadMoreArticles = useCallback(() => {
    if (!hasMore || loading) return;

    setLoading(true);
    const startIndex = (page - 1) * BATCH_SIZE;
    const newArticles = articlesData.slice(startIndex, startIndex + BATCH_SIZE);

    // Update articles and manage the hasMore state based on the new batch size
    if (newArticles.length > 0) {
      setArticles((prevArticles) => [...prevArticles, ...newArticles]);
      setPage((prevPage) => prevPage + 1); // Increment page for next batch
    }

    // If fewer than BATCH_SIZE articles are loaded, we've reached the end
    if (newArticles.length < BATCH_SIZE) {
      setHasMore(false);
    }

    setLoading(false);
  }, [page, hasMore, loading]);

  // Store loadMoreArticles in a ref for a stable reference in useEffect
  const loadMoreRef = useRef(loadMoreArticles);

  // Initial load of articles
  useEffect(() => {
    loadMoreRef.current = loadMoreArticles;
  }, [loadMoreArticles]);
  // Use the stable ref in useEffect
  useEffect(() => {
    loadMoreRef.current();
  }, []); // Empty dependency array ensures it only runs once

  return (
    <div className="container mx-auto">
      <PageTitle title="All Content" />
      <ArticleList articles={articles} />

      {/* Load More Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={loadMoreArticles}
          disabled={!hasMore || loading}
          className={`w-full max-w-md px-4 py-2 font-semibold text-white rounded-md transition-all
            ${hasMore ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          {hasMore ? (loading ? "Loading..." : "Load More Content") : "That's all we have"}
        </button>
      </div>
    </div>
  );
};

export default HomePage;