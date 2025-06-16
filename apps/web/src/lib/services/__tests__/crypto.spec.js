import { describe, it, expect } from 'vitest';
import { generateKeyPair, encrypt, decrypt } from '../crypto';

describe('Crypto Service', () => {
  it('should generate a valid key pair', () => {
    const keyPair = generateKeyPair();
    expect(keyPair).toHaveProperty('publicKey');
    expect(keyPair).toHaveProperty('privateKey');
  });

  it('should encrypt and decrypt data correctly', () => {
    const keyPair = generateKeyPair();
    const message = 'test message';
    const encrypted = encrypt(message, keyPair.publicKey);
    const decrypted = decrypt(encrypted, keyPair.privateKey);
    expect(decrypted).toBe(message);
  });
}); 