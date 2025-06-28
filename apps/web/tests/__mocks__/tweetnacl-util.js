/**
 * Mock for tweetnacl-util library
 */

// Mock encoding functions
export const encodeBase64 = jest.fn((data) => {
  if (data instanceof Uint8Array) {
    return Buffer.from(data).toString('base64');
  }
  return 'mock-base64-encoded';
});

export const decodeBase64 = jest.fn((str) => {
  return new Uint8Array(Buffer.from(str, 'base64'));
});

export const encodeUTF8 = jest.fn((data) => {
  if (data instanceof Uint8Array) {
    return new TextDecoder().decode(data);
  }
  return 'mock-utf8-encoded';
});

export const decodeUTF8 = jest.fn((str) => {
  return new TextEncoder().encode(str);
});

// Default export
export default {
  encodeBase64,
  decodeBase64,
  encodeUTF8,
  decodeUTF8
}; 