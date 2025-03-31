// Simple test utility to test the child numbering functionality
// Run with: node test.js

// Mock document and DOM elements
const mockDOM = {
  childForms: [],
  addChildBtn: { addEventListener: () => {} },
  jsonOutput: { textContent: '' },
  querySelector: () => ({ textContent: '' }),
  querySelectorAll: () => mockDOM.childForms
};

// Mock document object
global.document = {
  addEventListener: (event, callback) => {
    // Call the DOM Content Loaded callback immediately
    if (event === 'DOMContentLoaded') callback();
  },
  getElementById: (id) => {
    if (id === 'childrenContainer') return mockDOM;
    if (id === 'addChildBtn') return mockDOM.addChildBtn;
    if (id === 'jsonOutput') return mockDOM.jsonOutput;
    if (id === 'childTemplate') {
      return {
        content: {
          cloneNode: () => {
            const childForm = {
              dataset: {},
              querySelector: (selector) => {
                if (selector === '.child-title') {
                  return { textContent: '' };
                }
                if (selector === '.delete-child') {
                  return { addEventListener: () => {} };
                }
                return null;
              },
              querySelectorAll: () => []
            };
            return {
              querySelector: () => childForm
            };
          }
        }
      };
    }
    return null;
  },
  querySelectorAll: mockDOM.querySelectorAll
};

// Load the app code - will automatically run due to DOMContentLoaded listener
require('./app.js');

// Extract the app's data and functions for testing
const dataAndFunctions = (() => {
  // We need to get a reference to the internal data and functions
  // Redefine document.addEventListener to intercept the app initialization
  const originalAddEventListener = document.addEventListener;
  let appData = null;
  let appFunctions = {};
  
  document.addEventListener = (event, callback) => {
    if (event === 'DOMContentLoaded') {
      // Save original function
      const originalAddChild = window.addChild;
      const originalRemoveChild = window.removeChild;
      const originalReindexChildren = window.reindexChildren;
      
      // Define hook functions to capture internal data
      window.hookData = (data) => {
        appData = data;
      };
      
      window.addChild = function() {
        // Track calls to addChild
        console.log('Adding child...');
        return originalAddChild.apply(this, arguments);
      };
      
      window.removeChild = function(id) {
        // Track calls to removeChild
        console.log(`Removing child with ID: ${id}`);
        return originalRemoveChild.apply(this, arguments);
      };
      
      window.reindexChildren = function() {
        // Track calls to reindexChildren
        console.log('Reindexing children...');
        const result = originalReindexChildren.apply(this, arguments);
        console.log('Data after reindexing:', JSON.stringify(appData, null, 2));
        return result;
      };
      
      // Call the original callback
      callback();
    }
  };
  
  return { getData: () => appData };
})();

// Test code
console.log('Starting child numbering tests...');

// Add second child
console.log('\nTest 1: Adding a second child...');
if (typeof window.addChild === 'function') {
  window.addChild();
  // Check data structure
  console.log('Two children should be in the data structure now');
}

// Add third child
console.log('\nTest 2: Adding a third child...');
if (typeof window.addChild === 'function') {
  window.addChild();
  // Check data structure
  console.log('Three children should be in the data structure now');
}

// Remove second child
console.log('\nTest 3: Removing the second child...');
if (typeof window.removeChild === 'function') {
  // Remove child with ID 2
  window.removeChild(2);
  // Children should be reindexed to IDs 1 and 3
  console.log('After removal, should have IDs 1 and 3');
}

console.log('\nTest complete!');
