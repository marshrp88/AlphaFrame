import { describe, it, expect, beforeEach, vi } from 'vitest';
import { unlock, set, get, lock, isUnlocked } from '../../../src/lib/services/secureVault';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key]),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock crypto service
vi.mock('../../../src/lib/services/crypto', () => ({
  deriveKey: vi.fn(() => 'derived-key'),
  encrypt: vi.fn(data => `encrypted-${data}`),
  decrypt: vi.fn(data => {
    if (data === 'encrypted-{"test":"value"}') {
      return '{"test":"value"}';
    }
    throw new Error('Decryption failed');
  }),
  generateSalt: vi.fn(() => 'test-salt')
}));

describe('SecureVault', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('unlock', () => {
    it('should initialize vault with new salt if none exists', async () => {
      await unlock('test-password');
      expect(localStorage.setItem).toHaveBeenCalledWith('alphaframe_vault_salt', 'test-salt');
    });

    it('should create empty vault if no encrypted data exists', async () => {
      await unlock('test-password');
      expect(isUnlocked()).toBe(true);
      expect(get('test')).rejects.toThrow('Key not found in vault: test');
    });

    it('should decrypt existing vault data', async () => {
      localStorage.setItem('alphaframe_secure_vault', 'encrypted-{"test":"value"}');
      await unlock('test-password');
      expect(get('test')).toBe('value');
    });

    it('should throw error for invalid password', async () => {
      localStorage.setItem('alphaframe_secure_vault', 'invalid-data');
      await expect(unlock('wrong-password')).rejects.toThrow('Failed to unlock vault');
    });
  });

  describe('set', () => {
    it('should store and encrypt data', async () => {
      await unlock('test-password');
      await set('test-key', 'test-value');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'alphaframe_secure_vault',
        expect.stringContaining('encrypted-')
      );
    });

    it('should throw error when vault is locked', async () => {
      await expect(set('test-key', 'test-value')).rejects.toThrow('Vault is locked');
    });
  });

  describe('get', () => {
    it('should retrieve stored value', async () => {
      await unlock('test-password');
      await set('test-key', 'test-value');
      expect(get('test-key')).toBe('test-value');
    });

    it('should throw error when vault is locked', () => {
      expect(() => get('test-key')).toThrow('Vault is locked');
    });

    it('should throw error for non-existent key', async () => {
      await unlock('test-password');
      expect(() => get('non-existent')).toThrow('Key not found in vault: non-existent');
    });
  });

  describe('lock', () => {
    it('should clear vault data', async () => {
      await unlock('test-password');
      await set('test-key', 'test-value');
      lock();
      expect(isUnlocked()).toBe(false);
      expect(() => get('test-key')).toThrow('Vault is locked');
    });
  });

  describe('isUnlocked', () => {
    it('should return false when vault is locked', () => {
      expect(isUnlocked()).toBe(false);
    });

    it('should return true when vault is unlocked', async () => {
      await unlock('test-password');
      expect(isUnlocked()).toBe(true);
    });
  });
}); 