/**
 * SchemaManager.js - AlphaFrame VX.1
 * 
 * Purpose: Schema and data migration manager for IndexedDB and localStorage
 * with versioning, backward compatibility, and data integrity validation.
 * 
 * Procedure:
 * 1. Track schema versions and migration history
 * 2. Execute migrations in sequence with rollback support
 * 3. Validate data integrity after migrations
 * 4. Handle IndexedDB and localStorage synchronization
 * 5. Provide migration status and error recovery
 * 
 * Conclusion: Ensures data consistency across application versions
 * with safe migration paths and comprehensive error handling.
 */

import executionLogService from '../../core/services/ExecutionLogService.js';

/**
 * Current schema version
 */
const CURRENT_SCHEMA_VERSION = '1.2.0';

/**
 * Storage keys
 */
const STORAGE_KEYS = {
  SCHEMA_VERSION: 'alphaframe_schema_version',
  MIGRATION_HISTORY: 'alphaframe_migration_history',
  DATA_BACKUP: 'alphaframe_data_backup'
};

/**
 * Database configuration
 */
const DB_CONFIG = {
  name: 'AlphaFrameDB',
  version: 1,
  stores: {
    financialData: { keyPath: 'id', indexes: ['userId', 'date', 'category'] },
    userSettings: { keyPath: 'userId', indexes: ['settingKey'] },
    executionLogs: { keyPath: 'id', indexes: ['timestamp', 'type', 'userId'] },
    rules: { keyPath: 'id', indexes: ['userId', 'status', 'category'] },
    budgets: { keyPath: 'id', indexes: ['userId', 'period', 'category'] }
  }
};

/**
 * Migration definitions
 */
const MIGRATIONS = {
  '1.0.0': {
    description: 'Initial schema',
    up: async (db) => {
      // Create initial stores
      const stores = Object.entries(DB_CONFIG.stores);
      for (const [storeName, config] of stores) {
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, { keyPath: config.keyPath });
          
          // Create indexes
          if (config.indexes) {
            config.indexes.forEach(indexName => {
              store.createIndex(indexName, indexName, { unique: false });
            });
          }
        }
      }
    },
    down: async (db) => {
      // Drop all stores
      const stores = Object.keys(DB_CONFIG.stores);
      stores.forEach(storeName => {
        if (db.objectStoreNames.contains(storeName)) {
          db.deleteObjectStore(storeName);
        }
      });
    }
  },
  
  '1.1.0': {
    description: 'Add user preferences and notifications',
    up: async (db) => {
      // Add user preferences store
      if (!db.objectStoreNames.contains('userPreferences')) {
        const store = db.createObjectStore('userPreferences', { keyPath: 'userId' });
        store.createIndex('preferenceKey', 'preferenceKey', { unique: false });
      }
      
      // Add notifications store
      if (!db.objectStoreNames.contains('notifications')) {
        const store = db.createObjectStore('notifications', { keyPath: 'id', autoIncrement: true });
        store.createIndex('userId', 'userId', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('read', 'read', { unique: false });
      }
    },
    down: async (db) => {
      if (db.objectStoreNames.contains('userPreferences')) {
        db.deleteObjectStore('userPreferences');
      }
      if (db.objectStoreNames.contains('notifications')) {
        db.deleteObjectStore('notifications');
      }
    }
  },
  
  '1.2.0': {
    description: 'Add audit trail and data encryption',
    up: async (db) => {
      // Add audit trail store
      if (!db.objectStoreNames.contains('auditTrail')) {
        const store = db.createObjectStore('auditTrail', { keyPath: 'id', autoIncrement: true });
        store.createIndex('userId', 'userId', { unique: false });
        store.createIndex('action', 'action', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('resourceType', 'resourceType', { unique: false });
      }
      
      // Add encrypted data store
      if (!db.objectStoreNames.contains('encryptedData')) {
        const store = db.createObjectStore('encryptedData', { keyPath: 'key' });
        store.createIndex('userId', 'userId', { unique: false });
        store.createIndex('dataType', 'dataType', { unique: false });
      }
    },
    down: async (db) => {
      if (db.objectStoreNames.contains('auditTrail')) {
        db.deleteObjectStore('auditTrail');
      }
      if (db.objectStoreNames.contains('encryptedData')) {
        db.deleteObjectStore('encryptedData');
      }
    }
  }
};

/**
 * Schema Manager Class
 */
export class SchemaManager {
  constructor() {
    this.db = null;
    this.currentVersion = null;
  }

  /**
   * Initialize database and run migrations
   * @returns {Promise<boolean>} True if successful
   */
  async initialize() {
    try {
      await executionLogService.log('schema.initialization.started', {
        currentVersion: CURRENT_SCHEMA_VERSION
      });

      // Get current version from localStorage
      this.currentVersion = localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION) || '0.0.0';

      // Open database
      await this.openDatabase();

      // Run migrations if needed
      if (this.currentVersion !== CURRENT_SCHEMA_VERSION) {
        await this.runMigrations();
      }

      // Update version
      localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);

      await executionLogService.log('schema.initialization.completed', {
        fromVersion: this.currentVersion,
        toVersion: CURRENT_SCHEMA_VERSION
      });

      return true;
    } catch (error) {
      await executionLogService.logError('schema.initialization.failed', error);
      throw new Error(`Schema initialization failed: ${error.message}`);
    }
  }

  /**
   * Open IndexedDB database
   * @returns {Promise<void>}
   */
  async openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = () => {
        // Handle database upgrade
        this.handleDatabaseUpgrade();
      };
    });
  }

  /**
   * Handle database upgrade
   */
  handleDatabaseUpgrade() {
    // Handle database upgrade
    // console.log('Database upgrade needed');
  }

  /**
   * Run migrations from current version to target version
   * @returns {Promise<void>}
   */
  async runMigrations() {
    const migrationVersions = Object.keys(MIGRATIONS).sort();
    const currentIndex = migrationVersions.indexOf(this.currentVersion);
    const targetIndex = migrationVersions.indexOf(CURRENT_SCHEMA_VERSION);

    if (currentIndex === -1 || targetIndex === -1) {
      throw new Error('Invalid migration version');
    }

    // Create backup before migration
    await this.createBackup();

    try {
      // Run migrations in sequence
      for (let i = currentIndex; i <= targetIndex; i++) {
        const version = migrationVersions[i];
        if (version !== this.currentVersion) {
          await this.runMigration(version, 'up');
        }
      }

      // Update current version
      this.currentVersion = CURRENT_SCHEMA_VERSION;

      await executionLogService.log('schema.migration.completed', {
        fromVersion: this.currentVersion,
        toVersion: CURRENT_SCHEMA_VERSION
      });

    } catch (error) {
      // Rollback on error
      await this.rollbackMigration();
      throw error;
    }
  }

  /**
   * Run a specific migration
   * @param {string} version - Migration version
   * @param {string} direction - 'up' or 'down'
   * @returns {Promise<void>}
   */
  async runMigration(version, direction) {
    const migration = MIGRATIONS[version];
    if (!migration) {
      throw new Error(`Migration ${version} not found`);
    }

    await executionLogService.log('schema.migration.started', {
      version,
      direction,
      description: migration.description
    });

    try {
      if (direction === 'up') {
        await migration.up(this.db);
      } else {
        await migration.down(this.db);
      }

      // Record migration in history
      await this.recordMigration(version, direction, 'success');

      await executionLogService.log('schema.migration.success', {
        version,
        direction
      });

    } catch (error) {
      await this.recordMigration(version, direction, 'failed', error.message);
      await executionLogService.logError('schema.migration.failed', error, {
        version,
        direction
      });
      throw error;
    }
  }

  /**
   * Record migration in history
   * @param {string} version - Migration version
   * @param {string} direction - Migration direction
   * @param {string} status - Migration status
   * @param {string} error - Error message if failed
   * @returns {Promise<void>}
   */
  async recordMigration(version, direction, status, error = null) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.MIGRATION_HISTORY) || '[]');
    
    history.push({
      version,
      direction,
      status,
      error,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });

    localStorage.setItem(STORAGE_KEYS.MIGRATION_HISTORY, JSON.stringify(history));
  }

  /**
   * Create data backup before migration
   * @returns {Promise<void>}
   */
  async createBackup() {
    try {
      const backup = {
        timestamp: new Date().toISOString(),
        version: this.currentVersion,
        data: {}
      };

      // Backup IndexedDB data
      const stores = Object.keys(DB_CONFIG.stores);
      for (const storeName of stores) {
        const data = await this.getAllData(storeName);
        backup.data[storeName] = data;
      }

      // Backup localStorage data
      backup.localStorage = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('alphaframe_')) {
          backup.localStorage[key] = localStorage.getItem(key);
        }
      }

      localStorage.setItem(STORAGE_KEYS.DATA_BACKUP, JSON.stringify(backup));

      await executionLogService.log('schema.backup.created', {
        timestamp: backup.timestamp,
        version: backup.version
      });

    } catch (error) {
      await executionLogService.logError('schema.backup.failed', error);
      throw error;
    }
  }

  /**
   * Rollback migration using backup
   * @returns {Promise<void>}
   */
  async rollbackMigration() {
    try {
      const backupData = localStorage.getItem(STORAGE_KEYS.DATA_BACKUP);
      if (!backupData) {
        throw new Error('No backup available for rollback');
      }

      const backup = JSON.parse(backupData);

      // Restore IndexedDB data
      for (const [storeName, data] of Object.entries(backup.data)) {
        await this.restoreStoreData(storeName, data);
      }

      // Restore localStorage data
      for (const [key, value] of Object.entries(backup.localStorage)) {
        localStorage.setItem(key, value);
      }

      // Restore schema version
      localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, backup.version);
      this.currentVersion = backup.version;

      await executionLogService.log('schema.rollback.completed', {
        restoredVersion: backup.version,
        timestamp: backup.timestamp
      });

    } catch (error) {
      await executionLogService.logError('schema.rollback.failed', error);
      throw error;
    }
  }

  /**
   * Get all data from a store
   * @param {string} storeName - Store name
   * @returns {Promise<Array>} Store data
   */
  async getAllData(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Restore data to a store
   * @param {string} storeName - Store name
   * @param {Array} data - Data to restore
   * @returns {Promise<void>}
   */
  async restoreStoreData(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      // Clear existing data
      store.clear();

      // Add backup data
      data.forEach(item => {
        store.add(item);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * Get migration history
   * @returns {Array} Migration history
   */
  getMigrationHistory() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MIGRATION_HISTORY) || '[]');
  }

  /**
   * Get current schema version
   * @returns {string} Current version
   */
  getCurrentVersion() {
    return this.currentVersion;
  }

  /**
   * Validate data integrity
   * @returns {Promise<Object>} Validation result
   */
  async validateDataIntegrity() {
    const results = {
      valid: true,
      errors: [],
      warnings: []
    };

    try {
      // Check if all required stores exist
      const stores = Object.keys(DB_CONFIG.stores);
      for (const storeName of stores) {
        if (!this.db.objectStoreNames.contains(storeName)) {
          results.valid = false;
          results.errors.push(`Missing store: ${storeName}`);
        }
      }

      // Check data consistency
      for (const storeName of stores) {
        const data = await this.getAllData(storeName);
        
        // Basic validation
        data.forEach((item, index) => {
          if (!item.id && !item.userId) {
            results.warnings.push(`Item ${index} in ${storeName} missing required fields`);
          }
        });
      }

      return results;
    } catch (error) {
      results.valid = false;
      results.errors.push(`Validation failed: ${error.message}`);
      return results;
    }
  }
}

// Export singleton instance
export const schemaManager = new SchemaManager(); 