import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import ArticleList from '../components/ArticleList';
import PageTitle from '../components/PageTitle';

const BATCH_SIZE = 10;
const API_URL = 'https://6nq8by3vud.execute-api.us-east-2.amazonaws.com/prod/content';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Helper function to fetch articles from API
  const fetchArticles = async () => {
    const response = await axios.get(API_URL, {
      params: {
        limit: BATCH_SIZE,
        lastEvaluatedKey: lastEvaluatedKey ? lastEvaluatedKey : null
      }
    });
    const data = JSON.parse(response.data.body);
    return {
      newArticles: data.items,
      newLastEvaluatedKey: data.lastEvaluatedKey ? encodeURIComponent(JSON.stringify(data.lastEvaluatedKey)) : null
    };
  };

  // Function to load the next set of articles
  const loadMoreArticles = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const { newArticles, newLastEvaluatedKey } = await fetchArticles();

      // Update articles and pagination state
      if (newArticles) setArticles((prevArticles) => [...prevArticles, ...newArticles]);
      setLastEvaluatedKey(newLastEvaluatedKey);
      setHasMore(!!newLastEvaluatedKey && newArticles.length >= BATCH_SIZE);

    } catch (error) {
      console.error("Error fetching articles:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [lastEvaluatedKey, hasMore, loading]);

  // Initial load of articles
  useEffect(() => {
    loadMoreArticles();
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
