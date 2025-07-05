/**
 * SecureVault service for storing sensitive data
 */

const secureVault = {
  get: vi.fn(() => 'mock-token'),
  set: vi.fn(),
  remove: vi.fn(),
  clear: vi.fn()
};

export default secureVault; 