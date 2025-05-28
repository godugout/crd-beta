
// This file is used to set up the testing environment
import '@testing-library/jest-dom/extend-expect';

// Mock browser APIs that might not be available in the test environment
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};
