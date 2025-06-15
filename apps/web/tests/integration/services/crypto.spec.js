import { describe, it, expect, beforeEach } from 'vitest';
import { deriveKey, encrypt, decrypt, generateSalt } from '../../../src/lib/services/crypto';

describe('CryptoService Integration', () => {
  let testPassword;
  let testSalt;
  let testKey;
  let testData;

  beforeEach(async () => {
    testPassword = 'testPassword123!';
    testSalt = await generateSalt();
    testKey = await deriveKey(testPassword, testSalt);
    testData = { sensitive: 'data' };
  });

  it('should derive consistent keys from same password and salt', async () => {
    const key1 = await deriveKey(testPassword, testSalt);
    const key2 = await deriveKey(testPassword, testSalt);
    expect(key1).toBe(key2);
  });

  it('should encrypt and decrypt data correctly', async () => {
    const encrypted = await encrypt(JSON.stringify(testData), testKey);
    const decrypted = await decrypt(encrypted, testKey);
    expect(JSON.parse(decrypted)).toEqual(testData);
  });

  it('should fail decryption with wrong key', async () => {
    const encrypted = await encrypt(JSON.stringify(testData), testKey);
    const wrongKey = await deriveKey('wrongPassword', testSalt);
    await expect(decrypt(encrypted, wrongKey)).rejects.toThrow();
  });

  it('should generate unique salts', async () => {
    const salt1 = await generateSalt();
    const salt2 = await generateSalt();
    expect(salt1).not.toBe(salt2);
  });
}); 