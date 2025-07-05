/**
 * Mock for tweetnacl library
 * Provides all necessary crypto functions for testing
 */

// Mock secretbox operations
const secretbox = {
  keyLength: 32,
  nonceLength: 24,
  overheadLength: 16,
  
  // Mock encryption
  seal: vi.fn((message, nonce, key) => {
    // Return a mock encrypted message as Uint8Array
    const mockEncrypted = new Uint8Array(message.length + 16);
    mockEncrypted.set(message);
    mockEncrypted.set(new Uint8Array(16).fill(1), message.length); // Mock tag
    return mockEncrypted;
  }),
  
  // Mock decryption
  open: vi.fn((box, nonce, key) => {
    // Return the original message if inputs are valid
    if (box && box.length > 16) {
      return box.slice(0, box.length - 16);
    }
    return null; // Decryption failed
  })
};

// Mock box operations (for public key crypto)
const box = {
  keyPair: vi.fn(() => ({
    publicKey: new Uint8Array(32).fill(1),
    secretKey: new Uint8Array(32).fill(2)
  })),
  
  seal: vi.fn((message, recipientPublicKey, senderSecretKey) => {
    const mockEncrypted = new Uint8Array(message.length + 16);
    mockEncrypted.set(message);
    mockEncrypted.set(new Uint8Array(16).fill(1), message.length);
    return mockEncrypted;
  }),
  
  open: vi.fn((box, nonce, recipientSecretKey, senderPublicKey) => {
    if (box && box.length > 16) {
      return box.slice(0, box.length - 16);
    }
    return null;
  })
};

// Mock hash function
const hash = vi.fn((message) => {
  // Return a mock hash as Uint8Array
  return new Uint8Array(64).fill(0);
});

// Mock random bytes
const randomBytes = vi.fn((length) => {
  return new Uint8Array(length).fill(42);
});

// Mock sign operations
const sign = {
  keyPair: vi.fn(() => ({
    publicKey: new Uint8Array(32).fill(1),
    secretKey: new Uint8Array(64).fill(2)
  })),
  
  sign: vi.fn((message, secretKey) => {
    const signature = new Uint8Array(64).fill(1);
    const signedMessage = new Uint8Array(message.length + 64);
    signedMessage.set(signature);
    signedMessage.set(message, 64);
    return signedMessage;
  }),
  
  signDetached: vi.fn((message, secretKey) => {
    return new Uint8Array(64).fill(1);
  }),
  
  verify: vi.fn((signedMessage, publicKey) => {
    if (signedMessage && signedMessage.length > 64) {
      return signedMessage.slice(64);
    }
    return null;
  }),
  
  verifyDetached: vi.fn((message, signature, publicKey) => {
    return true; // Mock successful verification
  })
};

// Create the main nacl object
const nacl = {
  secretbox,
  box,
  hash,
  randomBytes,
  sign
};

// Export the mock nacl object
module.exports = nacl;
module.exports.default = nacl; 