// External Imports
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Internal Imports - Styles
import './index.css';

// Internal Imports - Context
import { AppProvider } from './context/AppContext';
import { FontProvider } from './context/FontContext';
import { TagColorProvider } from './context/TagColorContext';
import { ThemeProvider } from './context/ThemeContext';

// Internal Imports - Pages
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import TagContentPage from './pages/TagContentPage';
import TagListPage from './pages/TagListPage';
import NewArticlePage from './pages/NewArticlePage';

// Internal Imports - Components
import Layout from './components/Layout';

function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <TagColorProvider>
          <FontProvider>
            <Router basename="/ContentVault">
              <Layout onSearch={(selectedTags) => console.log('Selected tags:', selectedTags)}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/tags/all" element={<TagListPage />} />
                  <Route path="/tags/filter" element={<TagContentPage />} />
                  <Route path="/tags/:tag" element={<TagContentPage />} />
                  <Route path="/new" element={<NewArticlePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </Layout>
            </Router>
          </FontProvider>
        </TagColorProvider>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;