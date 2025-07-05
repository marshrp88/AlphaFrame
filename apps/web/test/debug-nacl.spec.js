import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock tweetnacl before importing
vi.mock('tweetnacl', () => ({
  secretbox: {
    keyLength: 32,
    nonceLength: 24,
    overheadLength: 16,
    seal: vi.fn(),
    open: vi.fn()
  },
  box: {
    keyPair: vi.fn(),
    seal: vi.fn(),
    open: vi.fn()
  },
  hash: vi.fn(),
  randomBytes: vi.fn(),
  sign: {
    keyPair: vi.fn(),
    sign: vi.fn(),
    signDetached: vi.fn(),
    verify: vi.fn(),
    verifyDetached: vi.fn()
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