/**
 * SecureVault Service
 * Manages a secure, in-memory vault that is persisted to localStorage in an encrypted format.
 * Uses the CryptoService for encryption/decryption operations.
 */

import { deriveKey, encrypt, decrypt, generateSalt } from './CryptoService';

// Private variables
let vaultData = null;
let vaultKey = null;
const VAULT_STORAGE_KEY = 'alphaframe_secure_vault';
const SALT_STORAGE_KEY = 'alphaframe_vault_salt';

/**
 * Initializes the vault by generating a salt if none exists
 */
const initializeVault = async () => {
  if (!localStorage.getItem(SALT_STORAGE_KEY)) {
    const salt = await generateSalt();
    localStorage.setItem(SALT_STORAGE_KEY, salt);
  }
};

/**
 * Unlocks the vault using the master password
 * @param {string} masterPassword - The user's master password
 * @throws {Error} If decryption fails or vault is corrupted
 */
export const unlock = async (masterPassword) => {
  await initializeVault();
  
  const salt = localStorage.getItem(SALT_STORAGE_KEY);
  vaultKey = await deriveKey(masterPassword, salt);
  
  const encryptedVault = localStorage.getItem(VAULT_STORAGE_KEY);
  if (!encryptedVault) {
    vaultData = {};
    return;
  }
  
  try {
    vaultData = JSON.parse(await decrypt(encryptedVault, vaultKey));
  } catch (error) {
    throw new Error('Failed to unlock vault: Invalid password or corrupted vault');
  }
};

/**
 * Sets a value in the vault
 * @param {string} key - The key to store the value under
 * @param {any} value - The value to store
 * @throws {Error} If vault is locked
 */
export const set = async (key, value) => {
  if (!vaultData) {
    throw new Error('Vault is locked');
  }
  
  vaultData[key] = value;
  
  try {
    const encryptedVault = await encrypt(JSON.stringify(vaultData), vaultKey);
    localStorage.setItem(VAULT_STORAGE_KEY, encryptedVault);
  } catch (error) {
    throw new Error('Failed to save vault data');
  }
};

/**
 * Gets a value from the vault
 * @param {string} key - The key to retrieve
 * @returns {any} The stored value
 * @throws {Error} If vault is locked or key doesn't exist
 */
export const get = (key) => {
  if (!vaultData) {
    throw new Error('Vault is locked');
  }
  
  if (!(key in vaultData)) {
    throw new Error(`Key not found in vault: ${key}`);
  }
  
  return vaultData[key];
};

/**
 * Locks the vault by clearing in-memory data
 */
export const lock = () => {
  vaultData = null;
  vaultKey = null;
};

/**
 * Checks if the vault is currently unlocked
 * @returns {boolean} True if vault is unlocked
 */
export const isUnlocked = () => {
  return vaultData !== null;
}; 
