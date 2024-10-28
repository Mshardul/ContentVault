// ArticleCard.jsx

import React, { useContext, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { AppContext } from '../context/AppContext';
import TagColorContext from '../context/TagColorContext';
import { darkenColor } from '../utils/colorUtils';

const CORS_PROXY = "https://api.allorigins.win/raw?url=";

const ArticleCard = ({ title, url, tags = [], thumbnail = "" }) => {
  const { thumbnailCache, setThumbnailCache } = useContext(AppContext);
  const [thumbnailUrl, setThumbnailUrl] = useState(thumbnailCache[url] || "");
  const [loading, setLoading] = useState(!thumbnailCache[url]);

  // Access tagColorMap from TagColorContext
  const tagColorMap = useContext(TagColorContext);

  // Log tagColorMap and tags to confirm color availability
  console.log("tagColorMap in ArticleCard:", tagColorMap);
  console.log("Tags for this article:", tags.join(", "));
  console.log("Tag colors for this article:", tags.map((tag) => tagColorMap[tag]).join(", "));

  useEffect(() => {
    if (thumbnail) {
      setThumbnailUrl(thumbnail);
      setLoading(false);
      return;
    }

    if (thumbnailCache[url]) {
      setThumbnailUrl(thumbnailCache[url]);
      setLoading(false);
      return;
    }

    const fetchThumbnail = async () => {
      try {
        const response = await fetch(`${CORS_PROXY}${url}`);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const ogImage = doc.querySelector('meta[property="og:image"]');
        const fetchedThumbnailUrl = ogImage ? ogImage.content : null;

        setThumbnailUrl(fetchedThumbnailUrl);
        setThumbnailCache((prev) => ({ ...prev, [url]: fetchedThumbnailUrl }));
      } catch (error) {
        console.error("Error fetching thumbnail:", error);
        setThumbnailUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchThumbnail();
  }, [url, thumbnail, thumbnailCache, setThumbnailCache]);

  return (
    <div
      className="max-w-sm bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-200 ease-in-out p-5 mb-6"
      onClick={(e) => {
        if (!e.target.closest(".tag")) {
          window.open(url, "_blank");
        }
      }}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 animate-pulse">
            <FaSpinner className="text-gray-500 animate-spin" />
          </div>
        ) : thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200">
            <span className="text-gray-500 text-sm">No Image Available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors">
          {title}
        </h3>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {tagColorMap &&
            tags.map((tag, index) => {
              const tagColorClass = tagColorMap[tag] || 'bg-blue-500 text-white';
              return (
                <a
                  key={index}
                  href={`/tags/${tag}`}
                  className={`rounded-full px-2 py-0.5 text-xs transition-colors tag ${tagColorClass}`}
                  style={{
                    '--hover-color': darkenColor(tagColorClass, 10),
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {tag}
                </a>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;