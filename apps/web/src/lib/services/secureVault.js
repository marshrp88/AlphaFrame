/**
 * SecureVault service for storing sensitive data
 */

const secureVault = {
  get: jest.fn(() => 'mock-token'),
  set: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn()
};

export default secureVault; 