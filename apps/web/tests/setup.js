import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Crypto } from '@peculiar/webcrypto';
import { setupTest } from './utils.jsx';

// --- React 18 / Vitest Test Environment Setup ---

// 1. Set the React 18 "act" environment flag.
// This tells React it's running in a test environment and prevents "act" warnings.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// 2. Automatically run cleanup after each test.
// This unmounts React trees that were mounted with render to prevent memory leaks.
afterEach(() => {
  cleanup();
});

// 3. Setup global test utilities.
beforeEach(() => {
  setupTest();
});

// 4. Polyfill the Web Crypto API for jsdom.
// The jsdom environment used by Vitest does not include a native crypto implementation.
if (typeof window.crypto === 'undefined') {
  window.crypto = new Crypto();
} 
