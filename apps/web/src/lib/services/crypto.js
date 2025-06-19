/**
 * CryptoService handles all cryptographic operations for AlphaFrame
 * This includes key derivation, encryption, and secure storage
 */
import nacl from 'tweetnacl';
import util from 'tweetnacl-util';

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
  const hash = nacl.hash(combined);

  // The encryption key for nacl.secretbox must be 32 bytes long.
  // We take the first 32 bytes of the 64-byte hash to use as our key.
  return util.encodeBase64(hash.slice(0, nacl.secretbox.keyLength));
};

/**
 * Encrypts sensitive data
 * @param {string} data - Data to encrypt
 * @param {string} key - Encryption key
 * @returns {Promise<string>} Encrypted data
 */
export const encrypt = async (data, key) => {
  // Generate a random nonce
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  
  // Convert data and key to Uint8Arrays
  const dataBytes = util.decodeUTF8(data);
  const keyBytes = util.decodeBase64(key);
  
  // Encrypt the data
  const encrypted = nacl.secretbox(dataBytes, nonce, keyBytes);
  
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
  const nonce = combined.slice(0, nacl.secretbox.nonceLength);
  const encrypted = combined.slice(nacl.secretbox.nonceLength);
  
  // Decrypt the data
  const decrypted = nacl.secretbox.open(encrypted, nonce, keyBytes);
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
  const salt = nacl.randomBytes(nacl.secretbox.nonceLength);
  return util.encodeBase64(salt);
}; 
