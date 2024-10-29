import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThumbnailCacheProvider } from './cache/ThumbnailCacheContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThumbnailCacheProvider>
      <App />
    </ThumbnailCacheProvider>
  </React.StrictMode>
);

reportWebVitals();