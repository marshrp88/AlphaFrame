import '@testing-library/jest-dom';
import { cleanup, configure } from '@testing-library/react';
import { Crypto } from '@peculiar/webcrypto';

// --- CRITICAL: Jest window.matchMedia Mock (Research-Recommended) ---
// This follows the research-recommended pattern for React 18 + Jest + jsdom compatibility

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated but required for React compatibility
    removeListener: jest.fn(), // deprecated but required for React compatibility
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// --- REACT 18 TEST ENVIRONMENT CONFIGURATION ---
// This is CRITICAL for preventing React 18 rendering lifecycle issues

// Configure React Testing Library for React 18
configure({
  // Increase timeout for async operations
  asyncUtilTimeout: 15000,
  
  // Better error messages for element queries
  getElementError: (message, container) => {
    const error = new Error(message);
    error.name = 'TestingLibraryElementError';
    return error;
  },
  
  // Disable automatic cleanup to prevent race conditions
  testIdAttribute: 'data-testid',
});

// Set React 18 specific environment flags
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock React 18 concurrent features
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock requestIdleCallback for React 18
global.requestIdleCallback = jest.fn((callback) => {
  return setTimeout(() => callback({ didTimeout: false }), 0);
});

global.cancelIdleCallback = jest.fn((id) => {
  clearTimeout(id);
});

// --- Comprehensive Browser API Mocks ---

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn();

// --- React 18 / Vitest Test Environment Setup ---

// 1. Set the React 18 "act" environment flag.
// This tells React it's running in a test environment and prevents "act" warnings.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// 2. Automatically run cleanup after each test.
// This unmounts React trees that were mounted with render to prevent memory leaks.
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// 3. Setup global test utilities.
beforeEach(() => {
  localStorageMock.getItem.mockReturnValue(null);
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
});

// 4. Polyfill the Web Crypto API for happy-dom.
// The happy-dom environment used by Vitest does not include a native crypto implementation.
if (typeof window.crypto === 'undefined') {
  window.crypto = new Crypto();
} 
