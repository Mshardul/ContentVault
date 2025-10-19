// React Imports
import { useCallback, useEffect, useState } from 'react';

// Internal Project Imports
import ArticleList from '../components/ArticleList';
import articlesData from '../data/tech_articles.json';
import PageTitle from '../components/PageTitle';

const BATCH_SIZE = 12;

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [lastEvaluatedIndex, setLastEvaluatedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Helper function to fetch articles from API
  const fetchArticles = async () => {
    const newLastEvaluatedIndex = Math.min(lastEvaluatedIndex+BATCH_SIZE+1, articlesData.length)
    const newArticles = articlesData.slice(lastEvaluatedIndex+1, newLastEvaluatedIndex)
    return {
      newArticles: newArticles,
      newLastEvaluatedIndex: newLastEvaluatedIndex
    }
  };

  // Function to load the next set of articles
  const loadMoreArticles = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const { newArticles, newLastEvaluatedIndex } = await fetchArticles();

      // Update articles and pagination state
      if (newArticles) setArticles((prevArticles) => [...prevArticles, ...newArticles]);
      setLastEvaluatedIndex(newLastEvaluatedIndex);
      setHasMore(!!newLastEvaluatedIndex && newArticles.length >= BATCH_SIZE);

    } catch (error) {
      console.error("Error fetching articles:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [lastEvaluatedIndex, hasMore, loading]);

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
          className={`button-primary ${!hasMore || loading ? 'button-disabled' : ''}`}
        >
          {hasMore ? (loading ? "Loading..." : "Load More Content") : "That's all we have"}
        </button>
      </div>
    </div>
  );
};

export default HomePage;
