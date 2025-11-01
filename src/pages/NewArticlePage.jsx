import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import ThemeContext from '../context/ThemeContext';
import { v4 as uuidv4 } from 'uuid';
import { FaCopy, FaCheck, FaSync } from 'react-icons/fa';
import TagMultiSelect from "../components/TagMultiSelect";

const NewArticlePage = () => {
  const { tags: contextTags } = useContext(AppContext);
  const { theme } = useContext(ThemeContext);
  const predefinedTags = contextTags.map((t) => t.name);
  
  // State declarations
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isFetchingThumbnail, setIsFetchingThumbnail] = useState(false);
  const [generatedJSON, setGeneratedJSON] = useState(null);
  const [formData, setFormData] = useState({
    authors: '',
    publication: '',
    published_on: '',
    title: '',
    thumbnailUrl: '',
    read: false,
    is_paid: false,
    rating: '',
    url: '',
    language: 'English',
    type: 'Article',
  });

  const fetchThumbnail = useCallback(async () => {
    if (!formData.url) {
      setFormData(prev => ({ ...prev, thumbnailUrl: '' }));
      return;
    }

    setIsFetchingThumbnail(true);
    try {
      const corsProxy = 'https://api.allorigins.win/raw?url=';
      const encodedUrl = encodeURIComponent(formData.url);
      const response = await fetch(`${corsProxy}${encodedUrl}`);
      const html = await response.text();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const selectors = [
        'meta[property="og:image"]',
        'meta[name="twitter:image"]',
        'meta[property="og:image:secure_url"]',
        'meta[itemprop="image"]',
        'link[rel="image_src"]'
      ];
      
      for (const selector of selectors) {
        const element = doc.querySelector(selector);
        if (element) {
          const thumbUrl = element.getAttribute('content') || element.getAttribute('href');
          if (thumbUrl) {
            setFormData(prev => ({ ...prev, thumbnailUrl: thumbUrl }));
            break;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching thumbnail:', error);
    } finally {
      setIsFetchingThumbnail(false);
    }
  }, [formData.url]);

  // Debounced thumbnail fetch on URL change
  useEffect(() => {
    const timeoutId = setTimeout(fetchThumbnail, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData.url, fetchThumbnail]);

  // Use the same function for manual refresh
  const handleRefreshThumbnail = fetchThumbnail;
  
  // Custom JSON formatter: arrays are kept compact (single-line), objects are pretty-printed
  const formatJSONCompact = (value, indent = 4, level = 0) => {
    const indentStr = ' '.repeat(indent * level);

    if (Array.isArray(value)) {
      // Always print arrays in a single line
      const items = value.map((el) => JSON.stringify(el));
      return '[' + items.join(', ') + ']';
    }

    if (value && typeof value === 'object') {
      const entries = Object.entries(value);
      if (entries.length === 0) return '{}';
      const lines = entries.map(([k, v]) => {
        const key = JSON.stringify(k);
        let valStr = formatJSONCompact(v, indent, level + 1);
        if (typeof valStr !== 'string') valStr = JSON.stringify(valStr);
        if (valStr && valStr.indexOf('\n') === -1) {
          return indentStr + ' '.repeat(indent) + key + ': ' + valStr;
        }
        // multi-line value (object)
        const indented = (valStr || '').split('\n').map((ln, idx) => (idx === 0 ? ln : ' '.repeat(indent * (level + 1)) + ln)).join('\n');
        return indentStr + ' '.repeat(indent) + key + ': ' + indented;
      });
      return '{\n' + lines.join(',\n') + '\n' + indentStr + '}';
    }

    // Always return a string
    try {
      return JSON.stringify(value);
    } catch {
      return 'null';
    }
  };

  const generateJSON = () => ({
    id: uuidv4(),
    title: formData.title,
    url: formData.url,
    thumbnail: formData.thumbnailUrl,
    authors: formData.authors.split(',').map(a => a.trim()).filter(a => a),
    publication: formData.publication,
  tags: selectedTags.map(t => typeof t === 'string' ? t : t.name || String(t)),
    type: formData.type,
    status: formData.status
  });

  const handleCopyJSON = () => {
    // Copy the full JSON as shown in the display
    if (!generatedJSON) return;
    const s = JSON.stringify(generatedJSON, null, 4);
    navigator.clipboard.writeText(s);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      // Clear rating if read unchecked
      if(name === 'read' && !checked) {
        setFormData((prev) => ({ ...prev, rating: '' }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update the JSON with current form data
    setGeneratedJSON(generateJSON());

    const authorsArray = formData.authors
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const today = new Date();
    const added_on =
      today.getDate().toString().padStart(2, '0') +
      ' ' +
      today.toLocaleString('default', { month: 'short' }) +
      ' ' +
      today.getFullYear();

    // Format published_on date from ISO yyyy-mm-dd to e.g. '02 Aug 2025'
    let publishedOnFormatted = formData.published_on;
    if (formData.published_on) {
      const d = new Date(formData.published_on);
      const day = d.getDate().toString().padStart(2, '0');
      const month = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear();
      publishedOnFormatted = `${day} ${month} ${year}`;
    }

    const articleJSON = {
      added_on,
      authors: authorsArray,
      publication: formData.publication.trim(),
      published_on: publishedOnFormatted,
      read: formData.read,
      is_paid: formData.is_paid,
      rating: formData.read ? formData.rating : null,
      tags: selectedTags,
      thumbnail: '', // Placeholder
      title: formData.title.trim(),
      url: formData.url.trim(),
      language: formData.language.trim() || 'English',
      type: formData.type,
      id: uuidv4(),
    };

    setGeneratedJSON(articleJSON);
  };

  // Basic flex row style

  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label className="block">
            Title *
            <input
              type="text" 
              name="title" 
              className="w-full h-10 px-3 py-2 box-border rounded-md border border-gray-300"
              value={formData.title} 
              onChange={handleInputChange}
              required
            />
          </label>
        </div>

        <div className="mt-4 md:flex md:gap-4">
          <div className="md:w-2/3 space-y-4">
            <div>
              <label className="block">
                URL *
                <input
                  type="url" 
                  name="url" 
                  className="w-full h-10 px-3 py-2 box-border rounded-md border border-gray-300"
                  value={formData.url} 
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>

            <div>
              <label className="block">
                Thumbnail URL
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="thumbnailUrl"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={formData.thumbnailUrl}
                    onChange={handleInputChange}
                    placeholder="Thumbnail URL will appear here automatically..."
                  />
                  <button
                    type="button"
                    onClick={handleRefreshThumbnail}
                    disabled={isFetchingThumbnail || !formData.url}
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <FaSync className={`w-4 h-4 ${isFetchingThumbnail ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </label>
            </div>
          </div>
          
          <div className="md:w-1/3 mt-4 md:mt-0">
            {formData.thumbnailUrl ? (
              <div className="w-full h-[200px] border rounded overflow-hidden bg-gray-50">
                <img
                  src={formData.thumbnailUrl}
                  alt="Article thumbnail"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-full h-[200px] border rounded flex items-center justify-center bg-gray-50">
                <span className="text-gray-400">No thumbnail available</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex-1">
            Authors (comma-separated) *
            <input
              type="text" name="authors" className="w-full h-10 px-3 py-2 box-border rounded-md border border-gray-300"
              value={formData.authors} onChange={handleInputChange}
              required
            />
          </label>

          <label className="flex-1">
            Publication *
            <input
              type="text" name="publication" className="w-full h-10 px-3 py-2 box-border rounded-md border border-gray-300"
              value={formData.publication} onChange={handleInputChange}
              required
            />
          </label>

          <label className="flex-1">
            Published On *
            <input
              type="date" name="published_on" className="w-full h-10 px-3 py-2 box-border rounded-md border border-gray-300"
              value={formData.published_on} onChange={handleInputChange}
              required
              max={new Date().toISOString().split('T')[0]} // no future dates
            />
          </label>
        </div>

        <div className="flex gap-4">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
            Read
            <input
              type="checkbox" name="read"
              checked={formData.read} onChange={handleInputChange}
            />
          </label>

          {formData.read && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
              Rating (out of 10)
              <input
                type="number" name="rating"
                min="0" max="10" step="1"
                value={formData.rating} onChange={handleInputChange}
                required={formData.read}
                style={{ textAlign: 'right' }}
              />
            </label>
          )}

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
            Paid
            <input
              type="checkbox" name="is_paid"
              checked={formData.is_paid} onChange={handleInputChange}
            />
          </label>
        </div>

        <div className="flex gap-4">
          <label className="flex-1">
            Type
            <select
              name="type" className="w-full h-10 px-3 py-2 box-border rounded-md border border-gray-300"
              value={formData.type} onChange={handleInputChange}
              required
            >
              <option value="Article">Article</option>
              <option value="Course">Course</option>
              <option value="Post">Post</option>
              <option value="Article Series">Article Series</option>
            </select>
          </label>

          <label className="flex-1">
            Language
            <input
              type="text" name="language"
              className="w-full h-10 px-3 py-2 box-border rounded-md border border-gray-300"
              value={formData.language} onChange={handleInputChange}
            />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Tags</label>
          <TagMultiSelect
            variant="add"
            allTags={predefinedTags} // The known list of existing tags
            initialSelectedTags={selectedTags} // The tags currently on the post
            onTagsChange={setSelectedTags} // The callback that updates the component state
            closeOnSelect={true}
          />
        </div>

        <div className="flex justify-center mt-8">
          <button type="submit" className="button-primary">
            Generate JSON
          </button>
        </div>
      </form>

      {generatedJSON && (
        <div style={{ width: '50%', marginLeft: '25%', marginTop: 30, textAlign: 'left' }}>
          <h3 className="mb-4">Generated JSON:</h3>
          <div className="relative">
            <button
              onClick={handleCopyJSON}
              className="absolute -top-2 -right-2 p-2 rounded-full hover:bg-opacity-20 transition-all duration-200 z-10"
              style={{ 
                color: 'var(--primaryColor)',
                backgroundColor: 'var(--cardBackgroundColor)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              title="Copy JSON"
            >
              <FaCopy size={16} />
            </button>
            <pre
              style={{
                background: 'var(--cardBackgroundColor)',
                color: 'var(--textColor)',
                padding: 15,
                borderRadius: 5,
                overflowX: 'auto',
                border: '1px solid var(--primaryColor)',
                borderOpacity: 0.2
              }}
            >
              {formatJSONCompact(generatedJSON, 4, 0)
                .split('\n')
                .map(line => '    ' + line)
                .join('\n')}
            </pre>
          </div>
          
          {/* Toast Notification */}
          <div
            className={`fixed bottom-4 right-4 py-2 px-4 rounded-md transition-all duration-300 flex items-center gap-2 ${
              showCopyToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{
              backgroundColor: 'var(--primaryColor)',
              color: '#ffffff'
            }}
          >
            <FaCheck size={16} />
            <span>JSON copied to clipboard</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewArticlePage;
