import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';

import TagMultiSelect from "../components/TagMultiSelect";

const NewArticlePage = () => {
  const { tags: contextTags } = useContext(AppContext);
  const predefinedTags = contextTags.map((t) => t.name);

  const [selectedTags, setSelectedTags] = useState([]);

  const [formData, setFormData] = useState({
    authors: '',
    publication: '',
    published_on: '', // Will store ISO date string 'YYYY-MM-DD'
    read: false,
    is_paid: false,
    rating: '', // rating out of 10 as string
    url: '',
    language: 'English',
    type: 'Article',
  });
  const [generatedJSON, setGeneratedJSON] = useState(null);

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
      title: '', // Placeholder
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
        <div className="flex">
          <label className="flex-1">
            URL *
            <input
              type="url" name="url" className="w-full"
              value={formData.url} onChange={handleInputChange}
              required
            />
          </label>

          <label className="flex-1">
            Authors (comma-separated) *
            <input
              type="text" name="authors" className="w-full"
              value={formData.authors} onChange={handleInputChange}
              required
            />
          </label>
        </div>

        <div className="flex">
          <label className="flex-1">
            Publication *
            <input
              type="text" name="publication" className="w-full"
              value={formData.publication} onChange={handleInputChange}
              required
            />
          </label>

          <label className="flex-1">
            Published On *
            <input
              type="date" name="published_on" className="w-full"
              value={formData.published_on} onChange={handleInputChange}
              required
              max={new Date().toISOString().split('T')[0]} // no future dates
              style={{ width: '100%', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </label>
        </div>

        <div className="flex">
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

        <div className="flex">
          <label className="flex-1">
            Type
            <select
              name="type" className="cv-input"
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
          <h3>Generated JSON:</h3>
          <pre
            style={{
              background: '#f4f4f4',
              padding: 15,
              borderRadius: 5,
              overflowX: 'auto',
            }}
          >
            {JSON.stringify(generatedJSON, null, 4)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default NewArticlePage;
