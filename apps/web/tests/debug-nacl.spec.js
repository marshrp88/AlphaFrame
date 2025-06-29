// Mock tweetnacl before importing
jest.mock('tweetnacl', () => ({
  secretbox: {
    keyLength: 32,
    nonceLength: 24,
    overheadLength: 16,
    seal: jest.fn(),
    open: jest.fn()
  },
  box: {
    keyPair: jest.fn(),
    seal: jest.fn(),
    open: jest.fn()
  },
  hash: jest.fn(),
  randomBytes: jest.fn(),
  sign: {
    keyPair: jest.fn(),
    sign: jest.fn(),
    signDetached: jest.fn(),
    verify: jest.fn(),
    verifyDetached: jest.fn()
  }
}));

import nacl from 'tweetnacl';

describe('NACL Mock Debug', () => {
  it('should load nacl mock correctly', () => {
    console.log('NACL object:', nacl);
    console.log('NACL secretbox:', nacl?.secretbox);
    console.log('NACL secretbox.nonceLength:', nacl?.secretbox?.nonceLength);
    
    expect(nacl).toBeDefined();
    expect(nacl.secretbox).toBeDefined();
    expect(nacl.secretbox.nonceLength).toBe(24);
  });
}); 