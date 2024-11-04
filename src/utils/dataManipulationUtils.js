// JSON output decorator
function jsonOutputDecorator(func) {
  return function(...args) {
      // Call the original function with all arguments
      const result = func(...args);
      // Return the result as a pretty JSON string
      return JSON.stringify(result, null, 4);
  };
}

// Utility function to filter elements based on the `where` conditions
function filterElements(elements, where) {
  return elements.filter(element => {
      return Object.keys(where).every(key => {
          if (Array.isArray(element[key])) {
              // Handle array properties (e.g., tags, authors)
              return element[key].includes(where[key]);
          } else {
              // Handle scalar properties (e.g., publication, thumbnail)
              return element[key] === where[key];
          }
      });
  });
}

// Function to add properties to all or filtered elements
function baseAddPropertiesToElements(elements, properties, where = {}) {
  let filteredElements = where && Object.keys(where).length > 0 ? filterElements(elements, where) : elements;
  filteredElements.forEach(element => {
      Object.assign(element, properties);
  });
}

// Function to update tags for all or filtered elements
function baseUpdateTags(elements, newTags, where = {}) {
  let filteredElements = where && Object.keys(where).length > 0 ? filterElements(elements, where) : elements;
  filteredElements.forEach(element => {
      element.tags = [...new Set([...element.tags, ...newTags])]; // Avoid duplicates
  });
}

// Decorate the functions
export const addPropertiesToElements = jsonOutputDecorator(baseAddPropertiesToElements);
export const updateTags = jsonOutputDecorator(baseUpdateTags);
