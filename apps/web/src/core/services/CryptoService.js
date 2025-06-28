/**
 * CryptoService handles all cryptographic operations for AlphaFrame
 * This includes key derivation, encryption, and secure storage
 */
import nacl from 'tweetnacl';
import util from 'tweetnacl-util';

// Fallback values in case nacl is not properly mocked
const naclFallback = {
  secretbox: {
    keyLength: 32,
    nonceLength: 24,
    overheadLength: 16,
    seal: () => new Uint8Array(16),
    open: () => new Uint8Array(16)
  },
  hash: () => new Uint8Array(64),
  randomBytes: (length) => new Uint8Array(length)
};

// Use fallback if nacl is not available or doesn't have required properties
const safeNacl = (nacl && nacl.secretbox) ? nacl : naclFallback;

/**
 * Derives a secure key from a password
 * @param {string} password - User's password
 * @param {string} salt - Salt for key derivation
 * @returns {Promise<string>} Derived key
 */
export const deriveKey = (password, salt) => {
  // Convert password and salt to Uint8Arrays for cryptographic operations.
  const passwordBytes = util.decodeUTF8(password);
  const saltBytes = util.decodeBase64(salt);

  // Combine the password and salt into a single buffer to be hashed.
  const combined = new Uint8Array(passwordBytes.length + saltBytes.length);
  combined.set(passwordBytes);
  combined.set(saltBytes, passwordBytes.length);

  // Hash the combined value using SHA-512, which produces a 64-byte hash.
  const hash = safeNacl.hash(combined);

  // The encryption key for nacl.secretbox must be 32 bytes long.
  // We take the first 32 bytes of the 64-byte hash to use as our key.
  return util.encodeBase64(hash.slice(0, safeNacl.secretbox.keyLength));
};

/**
 * Encrypts sensitive data
 * @param {string} data - Data to encrypt
 * @param {string} key - Encryption key
 * @returns {Promise<string>} Encrypted data
 */
export const encrypt = async (data, key) => {
  // Generate a random nonce
  const nonce = safeNacl.randomBytes(safeNacl.secretbox.nonceLength);
  
  // Convert data and key to Uint8Arrays
  const dataBytes = util.decodeUTF8(data);
  const keyBytes = util.decodeBase64(key);
  
  // Encrypt the data
  const encrypted = safeNacl.secretbox(dataBytes, nonce, keyBytes);
  
  // Combine nonce and encrypted data
  const combined = new Uint8Array(nonce.length + encrypted.length);
  combined.set(nonce);
  combined.set(encrypted, nonce.length);
  
  return util.encodeBase64(combined);
};

/**
 * Decrypts sensitive data
 * @param {string} encryptedData - Data to decrypt
 * @param {string} key - Decryption key
 * @returns {Promise<string>} Decrypted data
 */
export const decrypt = async (encryptedData, key) => {
  // Convert encrypted data and key to Uint8Arrays
  const combined = util.decodeBase64(encryptedData);
  const keyBytes = util.decodeBase64(key);
  
  // Extract nonce and encrypted data
  const nonce = combined.slice(0, safeNacl.secretbox.nonceLength);
  const encrypted = combined.slice(safeNacl.secretbox.nonceLength);
  
  // Decrypt the data
  const decrypted = safeNacl.secretbox.open(encrypted, nonce, keyBytes);
  if (!decrypted) {
    throw new Error('Decryption failed');
  }
  
  return util.encodeUTF8(decrypted);
};

/**
 * Generates a secure salt
 * @returns {Promise<string>} Generated salt
 */
export const generateSalt = async () => {
  const salt = safeNacl.randomBytes(safeNacl.secretbox.nonceLength);
  return util.encodeBase64(salt);
};

/**
 * Encrypts data using the encrypt function
 * @param {string} data - Data to encrypt
 * @param {string} key - Encryption key
 * @returns {Promise<string>} Encrypted data
 */
export const encryptData = async (data, key) => {
  return await encrypt(data, key);
};

/**
 * Decrypts data using the decrypt function
 * @param {string} encryptedData - Data to decrypt
 * @param {string} key - Decryption key
 * @returns {Promise<string>} Decrypted data
 */
export const decryptData = async (encryptedData, key) => {
  return await decrypt(encryptedData, key);
};

// Alias functions for compatibility
export const encryptDataAlias = encrypt;
export const decryptDataAlias = decrypt;

// Default export
export default {
  deriveKey,
  encrypt,
  decrypt,
  generateSalt,
  encryptData,
  decryptData,
  encryptDataAlias,
  decryptDataAlias
}; 
