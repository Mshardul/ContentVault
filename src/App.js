import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TagContentPage from './pages/TagContentPage';
import MultiTagContentPage from './pages/MultiTagContentPage';
import AboutPage from './pages/AboutPage';
import { AppProvider } from './context/AppContext';
import { TagColorProvider } from './context/TagColorContext';
import TagListPage from './pages/TagListPage';

function App() {
  return (
    <AppProvider>
      <TagColorProvider>
        <Router>
          <Layout onSearch={(selectedTags) => console.log('Selected tags:', selectedTags)}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tags/all-tags" element={<TagListPage />} />
              <Route path="/tags/:tag" element={<TagContentPage />} />
              <Route path="/tags/union-or-intersection" element={<MultiTagContentPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Layout>
        </Router>
      </TagColorProvider>
    </AppProvider>
  );
}

export default App;