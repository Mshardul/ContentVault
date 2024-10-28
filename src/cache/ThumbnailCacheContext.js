import { createContext, useContext, useState } from 'react';

const ThumbnailCacheContext = createContext();

export const ThumbnailCacheProvider = ({ children }) => {
  const [cache, setCache] = useState({});

  const addToCache = (url, thumbnailUrl) => {
    setCache((prevCache) => ({ ...prevCache, [url]: thumbnailUrl }));
  };

  return (
    <ThumbnailCacheContext.Provider value={{ cache, addToCache }}>
      {children}
    </ThumbnailCacheContext.Provider>
  );
};

export const useThumbnailCache = () => useContext(ThumbnailCacheContext);