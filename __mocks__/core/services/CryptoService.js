import { vi } from 'vitest';

const CryptoService = {
  encrypt: vi.fn().mockResolvedValue('encrypted-data'),
  decrypt: vi.fn().mockResolvedValue('decrypted-data'),
  generateKey: vi.fn().mockResolvedValue('mock-key'),
  generateSalt: vi.fn().mockResolvedValue('mock-salt'),
  deriveKey: vi.fn().mockResolvedValue('derived-key'),
  hash: vi.fn().mockReturnValue('mock-hash'),
  validateEncryption: vi.fn().mockReturnValue(true),
  validateRetirementResult: vi.fn().mockReturnValue(true)
};

export default CryptoService;
export { CryptoService }; 