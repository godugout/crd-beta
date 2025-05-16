
// Jest setup file
import '@testing-library/jest-dom';
import { setupTestEnvironment } from '../src/utils/testUtils';

// Setup global mocks and polyfills
setupTestEnvironment();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
    this.thresholds = [];
    this.root = null;
    this.rootMargin = "";
  }

  observe(element) {
    this.elements.add(element);
    this.callback([{
      isIntersecting: true,
      target: element,
      intersectionRatio: 1,
    }], this);
    return this;
  }

  unobserve(element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  takeRecords() {
    return Array.from(this.elements).map(element => ({
      isIntersecting: true,
      target: element,
      intersectionRatio: 1,
    }));
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock
});

// Mock console.error to catch React warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalConsoleError(...args);
};
