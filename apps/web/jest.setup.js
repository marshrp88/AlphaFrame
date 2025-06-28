// Jest global setup for comprehensive test environment
// This provides mocks for all problematic dependencies

// Mock import.meta.env globally
Object.defineProperty(globalThis, 'import', {
  value: {},
  writable: true,
});

Object.defineProperty(globalThis, 'import.meta', {
  value: {
    env: {
      VITE_APP_ENV: 'test',
      VITE_PLAID_CLIENT_ID: 'test-client-id',
      VITE_PLAID_SECRET: 'test-secret',
      VITE_PLAID_ENV: 'sandbox',
      VITE_AUTH0_DOMAIN: 'test.auth0.com',
      VITE_AUTH0_CLIENT_ID: 'test-auth0-client-id',
      VITE_AUTH0_AUDIENCE: 'test-audience',
      VITE_AUTH0_REDIRECT_URI: 'http://localhost:5173',
      VITE_API_URL: 'http://localhost:3000/api',
      VITE_APP_URL: 'http://localhost:5173',
      VITE_WEBHOOK_URL: 'http://localhost:3000/webhook',
      VITE_WEBHOOK_SECRET: 'test-webhook-secret',
      VITE_SENDGRID_API_KEY: 'test-sendgrid-key',
      VITE_FROM_EMAIL: 'noreply@alphaframe.com',
      VITE_BETA_MODE: 'false',
      VITE_PLAID_INTEGRATION: 'true',
      VITE_WEBHOOKS_ENABLED: 'true',
      VITE_NOTIFICATIONS_ENABLED: 'true',
      VITE_LOG_LEVEL: 'info',
      VITE_DEBUG_MODE: 'false',
      VITE_ENCRYPTION_KEY: 'test-encryption-key',
      VITE_JWT_SECRET: 'test-jwt-secret',
      VITE_SENTRY_DSN: '',
      VITE_ANALYTICS_ID: '',
      VITE_CUSTOM_ENV_VAR: 'test-value',
      DEV: false,
      PROD: true,
      MODE: 'test'
    },
  },
  writable: true,
});

// Mock nacl crypto library
jest.mock('tweetnacl', () => ({
  box: {
    keyPair: jest.fn(() => ({
      publicKey: new Uint8Array(32),
      secretKey: new Uint8Array(64)
    })),
    open: jest.fn((_message, _nonce, _recipientPublicKey, _senderSecretKey) => new Uint8Array(10)),
    seal: jest.fn((_message, _recipientPublicKey) => new Uint8Array(10))
  },
  secretbox: {
    keyPair: jest.fn(() => ({
      publicKey: new Uint8Array(32),
      secretKey: new Uint8Array(64)
    })),
    open: jest.fn((_message, _nonce, _key) => new Uint8Array(10)),
    seal: jest.fn((_message, _nonce, _key) => new Uint8Array(10))
  },
  sign: {
    keyPair: jest.fn(() => ({
      publicKey: new Uint8Array(32),
      secretKey: new Uint8Array(64)
    })),
    open: jest.fn((_message, _signature, _publicKey) => new Uint8Array(10)),
    sign: jest.fn((_message, _secretKey) => new Uint8Array(10)),
    signDetached: jest.fn((_message, _secretKey) => new Uint8Array(64)),
    verify: jest.fn((_message, _signature, _publicKey) => true),
    verifyDetached: jest.fn((_message, _signature, _publicKey) => true)
  },
  randomBytes: jest.fn(() => new Uint8Array(32)),
  util: {
    decodeBase64: jest.fn((_str) => new Uint8Array(10)),
    encodeBase64: jest.fn((_arr) => 'mock-base64-string'),
    decodeUTF8: jest.fn((_str) => new Uint8Array(10)),
    encodeUTF8: jest.fn((_arr) => 'mock-utf8-string')
  }
}));

// Mock tweetnacl globally
global.nacl = {
  secretbox: {
    keyLength: 32,
    nonceLength: 24,
    overheadLength: 16,
    seal: jest.fn((_message, _nonce, _key) => {
      const mockEncrypted = new Uint8Array(_message.length + 16);
      mockEncrypted.set(_message);
      return mockEncrypted;
    }),
    open: jest.fn((_box, _nonce, _key) => {
      if (_box && _box.length > 16) {
        return _box.slice(0, _box.length - 16);
      }
      return new Uint8Array(10);
    })
  },
  box: {
    keyPair: jest.fn(() => ({
      publicKey: new Uint8Array(32).fill(1),
      secretKey: new Uint8Array(32).fill(2)
    })),
    seal: jest.fn((_message, _recipientPublicKey, _senderSecretKey) => {
      const mockEncrypted = new Uint8Array(_message.length + 16);
      mockEncrypted.set(_message);
      return mockEncrypted;
    }),
    open: jest.fn((_box, _nonce, _recipientSecretKey, _senderPublicKey) => {
      if (_box && _box.length > 16) {
        return _box.slice(0, _box.length - 16);
      }
      return new Uint8Array(10);
    })
  },
  hash: jest.fn((_message) => new Uint8Array(64).fill(0)),
  randomBytes: jest.fn((_length) => new Uint8Array(_length).fill(42)),
  sign: {
    keyPair: jest.fn(() => ({
      publicKey: new Uint8Array(32).fill(1),
      secretKey: new Uint8Array(64).fill(2)
    })),
    sign: jest.fn((_message, _secretKey) => {
      const mockSigned = new Uint8Array(_message.length + 64);
      mockSigned.set(_message);
      return mockSigned;
    }),
    signDetached: jest.fn((_message, _secretKey) => {
      return new Uint8Array(64);
    }),
    verify: jest.fn((_signedMessage, _publicKey) => {
      if (_signedMessage && _signedMessage.length > 64) {
        return _signedMessage.slice(64);
      }
      return null;
    }),
    verifyDetached: jest.fn((_message, _signature, _publicKey) => {
      return true;
    })
  }
};

// Mock tweetnacl-util
global.tweetnaclUtil = {
  encodeBase64: jest.fn((_data) => Buffer.from(_data).toString('base64')),
  decodeBase64: jest.fn((_str) => Buffer.from(_str, 'base64')),
  encodeUTF8: jest.fn((_str) => new TextEncoder().encode(_str)),
  decodeUTF8: jest.fn((_bytes) => new TextDecoder().decode(_bytes))
};

// Mock crypto APIs for Node environment
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: jest.fn((_array) => {
      for (let _i = 0; _i < _array.length; _i++) {
        _array[_i] = Math.floor(Math.random() * 256);
      }
      return _array;
    }),
    subtle: {
      generateKey: jest.fn().mockResolvedValue({}),
      encrypt: jest.fn().mockResolvedValue(new Uint8Array(16)),
      decrypt: jest.fn().mockResolvedValue(new Uint8Array(16)),
      sign: jest.fn().mockResolvedValue(new Uint8Array(64)),
      verify: jest.fn().mockResolvedValue(true),
      digest: jest.fn().mockResolvedValue(new Uint8Array(32))
    }
  };
}

// Mock localStorage for Node environment
if (typeof global.localStorage === 'undefined') {
  global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    key: jest.fn(),
    length: 0
  };
}

// Mock sessionStorage for Node environment
if (typeof global.sessionStorage === 'undefined') {
  global.sessionStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    key: jest.fn(),
    length: 0
  };
}

// Mock IndexedDB for Node environment
if (typeof global.indexedDB === 'undefined') {
  global.indexedDB = {
    open: jest.fn(() => ({
      onerror: null,
      onsuccess: null,
      onupgradeneeded: null,
      result: {
        objectStoreNames: [],
        createObjectStore: jest.fn(() => ({
          createIndex: jest.fn()
        })),
        transaction: jest.fn(() => ({
          objectStore: jest.fn(() => ({
            add: jest.fn(() => ({ onsuccess: null, onerror: null })),
            get: jest.fn(() => ({ onsuccess: null, onerror: null })),
            getAll: jest.fn(() => ({ onsuccess: null, onerror: null })),
            delete: jest.fn(() => ({ onsuccess: null, onerror: null }))
          }))
        }))
      }
    }))
  };
}

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

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock fetch for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    headers: new Map(),
    clone: function() { return this; }
  })
);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  log: jest.fn()
}; 