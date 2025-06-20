import '@testing-library/jest-dom';
import { setupTest } from './utils.jsx';
import { Crypto } from '@peculiar/webcrypto';

// Setup global test environment
beforeEach(() => {
  setupTest();
});

// Polyfill Web Crypto API for jsdom
if (typeof window.crypto === 'undefined') {
  window.crypto = new Crypto();
} 
