/**
 * ExecutionLogService.js
 * 
 * Purpose: Centralized logging service for AlphaPro that encrypts and persists
 * all significant computations and user actions for audit trails and analytics.
 * 
 * Procedure: 
 * 1. Creates structured log entries with timestamp, type, and encrypted payload
 * 2. Uses CryptoService to encrypt sensitive log data
 * 3. Stores logs in IndexedDB for local-first persistence
 * 4. Provides methods for other services to log events
 * 
 * Conclusion: This service enables comprehensive tracking of user actions,
 * system events, and financial calculations while maintaining zero-knowledge
 * compliance through encryption.
 */

import { encryptData, decryptData } from './crypto.js';

// Log entry schema for consistent structure
const LOG_SCHEMA = {
  timestamp: Date.now(),
  type: 'string', // e.g., 'portfolio.analysis.run', 'rule.triggered'
  payload: 'object', // encrypted data
  severity: 'string', // 'info', 'warning', 'error'
  userId: 'string', // for future multi-user support
  sessionId: 'string' // for grouping related actions
};

class ExecutionLogService {
  constructor() {
    this.dbName = 'AlphaProLogs';
    this.storeName = 'execution_logs';
    this.dbVersion = 1;
    this.isInitialized = false;
    this.sessionId = this.generateSessionId();
  }

  /**
   * Generate a unique session ID for grouping related log entries
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize IndexedDB connection for log storage
   */
  async initialize() {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Failed to open ExecutionLogService database:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        console.log('ExecutionLogService initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object store for logs if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          // Create indexes for efficient querying
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('severity', 'severity', { unique: false });
          store.createIndex('sessionId', 'sessionId', { unique: false });
        }
      };
    });
  }

  /**
   * Create and store a new log entry
   * @param {string} type - Log event type (e.g., 'portfolio.analysis.run')
   * @param {object} payload - Data to log (will be encrypted)
   * @param {string} severity - Log severity level ('info', 'warning', 'error')
   * @param {string} userId - User identifier (optional)
   */
  async log(type, payload = {}, severity = 'info', userId = 'default') {
    try {
      await this.initialize();

      // Validate input parameters
      if (!type || typeof type !== 'string') {
        throw new Error('Log type must be a non-empty string');
      }

      if (typeof payload !== 'object') {
        throw new Error('Log payload must be an object');
      }

      if (!['info', 'warning', 'error'].includes(severity)) {
        throw new Error('Severity must be one of: info, warning, error');
      }

      // Create log entry structure
      const logEntry = {
        timestamp: Date.now(),
        type,
        payload: await this.encryptPayload(payload),
        severity,
        userId,
        sessionId: this.sessionId
      };

      // Store in IndexedDB
      await this.storeLog(logEntry);

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${severity.toUpperCase()}] ${type}:`, payload);
      }

      return logEntry;
    } catch (error) {
      console.error('Failed to create log entry:', error);
      // Don't throw - logging failures shouldn't break the app
      return null;
    }
  }

  /**
   * Encrypt the log payload using CryptoService
   * @param {object} payload - Data to encrypt
   * @returns {string} - Encrypted payload
   */
  async encryptPayload(payload) {
    try {
      const payloadString = JSON.stringify(payload);
      return await encryptData(payloadString);
    } catch (error) {
      console.error('Failed to encrypt log payload:', error);
      // Return a fallback encrypted string if encryption fails
      return await encryptData(JSON.stringify({ error: 'Encryption failed', originalPayload: payload }));
    }
  }

  /**
   * Decrypt a log payload
   * @param {string} encryptedPayload - Encrypted payload string
   * @returns {object} - Decrypted payload
   */
  async decryptPayload(encryptedPayload) {
    try {
      const decryptedString = await decryptData(encryptedPayload);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Failed to decrypt log payload:', error);
      return { error: 'Decryption failed', encryptedPayload };
    }
  }

  /**
   * Store log entry in IndexedDB
   * @param {object} logEntry - Log entry to store
   */
  async storeLog(logEntry) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(logEntry);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Retrieve logs with optional filtering
   * @param {object} filters - Filter criteria
   * @param {number} limit - Maximum number of logs to return
   * @returns {Array} - Array of decrypted log entries
   */
  async getLogs(filters = {}, limit = 100) {
    try {
      await this.initialize();

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();

        request.onsuccess = async () => {
          try {
            let logs = request.result;

            // Apply filters
            if (filters.type) {
              logs = logs.filter(log => log.type === filters.type);
            }
            if (filters.severity) {
              logs = logs.filter(log => log.severity === filters.severity);
            }
            if (filters.userId) {
              logs = logs.filter(log => log.userId === filters.userId);
            }
            if (filters.sessionId) {
              logs = logs.filter(log => log.sessionId === filters.sessionId);
            }
            if (filters.startTime) {
              logs = logs.filter(log => log.timestamp >= filters.startTime);
            }
            if (filters.endTime) {
              logs = logs.filter(log => log.timestamp <= filters.endTime);
            }

            // Sort by timestamp (newest first)
            logs.sort((a, b) => b.timestamp - a.timestamp);

            // Apply limit
            logs = logs.slice(0, limit);

            // Decrypt payloads
            const decryptedLogs = await Promise.all(
              logs.map(async (log) => ({
                ...log,
                payload: await this.decryptPayload(log.payload)
              }))
            );

            resolve(decryptedLogs);
          } catch (error) {
            reject(error);
          }
        };

        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to retrieve logs:', error);
      return [];
    }
  }

  /**
   * Clear all logs (useful for testing or user privacy)
   */
  async clearLogs() {
    try {
      await this.initialize();

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();

        request.onsuccess = () => {
          console.log('All logs cleared successfully');
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to clear logs:', error);
      throw error;
    }
  }

  /**
   * Get log statistics for analytics
   * @returns {object} - Statistics about stored logs
   */
  async getLogStats() {
    try {
      const logs = await this.getLogs({}, 10000); // Get all logs for stats
      
      const stats = {
        totalLogs: logs.length,
        byType: {},
        bySeverity: {},
        bySession: {},
        timeRange: {
          earliest: logs.length > 0 ? Math.min(...logs.map(l => l.timestamp)) : null,
          latest: logs.length > 0 ? Math.max(...logs.map(l => l.timestamp)) : null
        }
      };

      logs.forEach(log => {
        // Count by type
        stats.byType[log.type] = (stats.byType[log.type] || 0) + 1;
        
        // Count by severity
        stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1;
        
        // Count by session
        stats.bySession[log.sessionId] = (stats.bySession[log.sessionId] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Failed to get log statistics:', error);
      return {
        totalLogs: 0,
        byType: {},
        bySeverity: {},
        bySession: {},
        timeRange: { earliest: null, latest: null }
      };
    }
  }

  /**
   * Convenience methods for common log types
   */
  async logPortfolioAnalysis(payload) {
    return this.log('portfolio.analysis.run', payload, 'info');
  }

  async logRuleTriggered(payload) {
    return this.log('rule.triggered', payload, 'info');
  }

  async logBudgetForecast(payload) {
    return this.log('budget.forecast.generated', payload, 'info');
  }

  async logSimulationRun(payload) {
    return this.log('simulation.run', payload, 'info');
  }

  async logError(type, error, context = {}) {
    return this.log(type, {
      error: error.message || error,
      stack: error.stack,
      context
    }, 'error');
  }
}

// Export singleton instance
const executionLogService = new ExecutionLogService();
export default executionLogService;

// Also export the class for testing
export { ExecutionLogService }; 