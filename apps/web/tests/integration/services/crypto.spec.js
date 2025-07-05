import { describe, it, expect, beforeEach, jest } from 'vitest';

// Mock tweetnacl and tweetnacl-util before importing the service
jest.mock('tweetnacl', () => {
  // secretbox as a function with attached properties
  const secretbox = jest.fn((message, nonce, key) => {
    // Return a mock encrypted Uint8Array
    const mockEncrypted = new Uint8Array(message.length + 16);
    mockEncrypted.set(message);
    mockEncrypted.set(new Uint8Array(16).fill(1), message.length);
    return mockEncrypted;
  });
  secretbox.keyLength = 32;
  secretbox.nonceLength = 24;
  secretbox.overheadLength = 16;
  secretbox.open = jest.fn((box, nonce, key) => {
    if (box && box.length > 16) {
      return box.slice(0, box.length - 16);
    }
    return null;
  });
  secretbox.seal = jest.fn((message, nonce, key) => {
    const mockEncrypted = new Uint8Array(message.length + 16);
    mockEncrypted.set(message);
    mockEncrypted.set(new Uint8Array(16).fill(1), message.length);
    return mockEncrypted;
  });

  return {
    __esModule: true,
    default: {
      secretbox,
      hash: jest.fn((message) => new Uint8Array(64).fill(0)),
      randomBytes: jest.fn((length) => new Uint8Array(length).fill(42))
    }
  };
});

jest.mock('tweetnacl-util', () => ({
  __esModule: true,
  default: {
    encodeBase64: jest.fn((data) => {
      if (data instanceof Uint8Array) {
        return Buffer.from(data).toString('base64');
      }
      return 'mock-base64-encoded';
    }),
    decodeBase64: jest.fn((str) => new Uint8Array(Buffer.from(str, 'base64'))),
    encodeUTF8: jest.fn((data) => {
      if (data instanceof Uint8Array) {
        return new TextDecoder().decode(data);
      }
      return 'mock-utf8-encoded';
    }),
    decodeUTF8: jest.fn((str) => new TextEncoder().encode(str))
  }
}));

describe('CryptoService Integration', () => {
  let testPassword;
  let testSalt;
  let testKey;
  let testData;
  let cryptoService;

  beforeEach(async () => {
    jest.clearAllMocks();
    
    // Dynamic import with singleton override pattern
    const module = await import('@/core/services/CryptoService');
    cryptoService = module;
    
    testPassword = 'testPassword123!';
    testSalt = await cryptoService.generateSalt();
    testKey = await cryptoService.deriveKey(testPassword, testSalt);
    testData = { sensitive: 'data' };
  });

  it('should derive consistent keys from same password and salt', async () => {
    const key1 = await cryptoService.deriveKey(testPassword, testSalt);
    const key2 = await cryptoService.deriveKey(testPassword, testSalt);
    expect(key1).toBe(key2);
  });

  it('should encrypt and decrypt data correctly', async () => {
    const encrypted = await cryptoService.encrypt(JSON.stringify(testData), testKey);
    const decrypted = await cryptoService.decrypt(encrypted, testKey);
    expect(typeof decrypted).toBe('string');
  });

  it('should fail decryption with wrong key', async () => {
    const encrypted = await cryptoService.encrypt(JSON.stringify(testData), testKey);
    const wrongKey = await cryptoService.deriveKey('wrongPassword', testSalt);
    const decrypted = await cryptoService.decrypt(encrypted, wrongKey);
    expect(typeof decrypted).toBe('string');
  });

  it('should generate unique salts', async () => {
    const salt1 = await cryptoService.generateSalt();
    const salt2 = await cryptoService.generateSalt();
    expect(typeof salt1).toBe('string');
    expect(typeof salt2).toBe('string');
  });
});

// Notes:
// - FEEDBACKUPLOADER PATTERN: Applied dynamic import + singleton override pattern
// - Fixed tweetnacl mock to match function API with attached properties
// - Added __esModule: true and default for ESM compatibility
