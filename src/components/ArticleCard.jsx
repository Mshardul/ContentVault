import React, { useContext, useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { AppContext } from '../context/AppContext';
import TagsList from '../components/TagsList';
import statusIconConfig from '../config/statusIconConfig';
import typeIconConfig from '../config/typeIconConfig';

const CORS_PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://cors-anywhere.herokuapp.com/",
  "https://thingproxy.freeboard.io/fetch/",
  "https://api.codetabs.com/v1/proxy?quest=",
  "https://proxy.cors.sh/",
  "https://corsproxy.io/?"
];

const CORS_PROXY = "https://thingproxy.freeboard.io/fetch/";

const ArticleCard = ({ title, url, tags = [], thumbnail = "", statusIndicators = [], type = "" }) => {
  const { thumbnailCache, setThumbnailCache } = useContext(AppContext);
  const [thumbnailUrl, setThumbnailUrl] = useState(thumbnailCache[url] || "");
  const [loading, setLoading] = useState(!thumbnailCache[url]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Create refs to hold the current values of thumbnailCache and setThumbnailCache
  const thumbnailCacheRef = useRef(thumbnailCache);
  const setThumbnailCacheRef = useRef(setThumbnailCache);

  // Keep refs in sync with the current values
  useEffect(() => {
    thumbnailCacheRef.current = thumbnailCache;
    setThumbnailCacheRef.current = setThumbnailCache;
  }, [thumbnailCache, setThumbnailCache]);

  useEffect(() => {
    // Initialize selectedTags on mount
    setSelectedTags(tags.map(tag => ({ name: tag, count: 0 })));

    if (thumbnail) {
      setThumbnailUrl(thumbnail);
      setLoading(false);
      return;
    }

    if (thumbnailCacheRef.current[url]) {
      setThumbnailUrl(thumbnailCacheRef.current[url]);
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

        if (fetchedThumbnailUrl) {
          setThumbnailUrl(fetchedThumbnailUrl);

          // Use the ref’s current value of setThumbnailCache to avoid dependency re-renders
          setThumbnailCacheRef.current(prev => ({ ...prev, [url]: fetchedThumbnailUrl }));
        }
      } catch (error) {
        console.error("Error fetching thumbnail:", error);
        setThumbnailUrl("");
      } finally {
        setLoading(false);
      }
    };

    fetchThumbnail();
  }, [url, thumbnail]);

  return (
    <div
      className="card max-w-sm bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-200 ease-in-out p-5 mb-6"
      onClick={(e) => {
        if (!e.target.closest(".tag")) {
          window.open(url, "_blank");
        }
      }}
    >
      {/* Status Icons - Top-Left */}
      <div className="absolute top-2 left-2 flex space-x-2 z-10">
        {statusIndicators.map((status, index) => {
          const StatusIcon = statusIconConfig[status]?.icon;
          const colorClass = statusIconConfig[status]?.color;
          const tooltip = statusIconConfig[status]?.tooltip;

          return (
            StatusIcon && (
              <div
                key={index}
                className={`relative ${colorClass}`}
                title={tooltip}
                style={{
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)', // Subtle shadow for visibility
                }}
              >
                <StatusIcon className="w-6 h-6" />
              </div>
            )
          );
        })}
      </div>

      {/* Type Indicator - Top-Right */}
      {type && (() => {
        const { icon: TypeIcon, color: typeColorClass, tooltip: typeTooltip } = typeIconConfig[type] || {};
        return TypeIcon ? (
          <div
            className={`absolute top-2 right-2 ${typeColorClass} z-10`}
            title={typeTooltip}
          >
            <TypeIcon className="w-6 h-6" />
          </div>
        ) : null;
      })()}

      {/* Thumbnail */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 animate-pulse">
            <FaSpinner className="text-gray-500 animate-spin" />
          </div>
        ) : thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 font-semibold">
            No Image Available
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4">
        {/* Title */}
        <h3 className="text-lg font-semibold transition-colors">
          {title}
        </h3>

        {/* Tags */}
        <TagsList size={"sm"} selectedTags={selectedTags} />
      </div>
    </div>
  );
};

export default ArticleCard;
