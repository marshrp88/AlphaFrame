/**
 * ExecutionLogService.js
 * 
 * Purpose: Centralized logging service for AlphaPro with structured schema,
 * AES-256-GCM encryption, and IndexedDB persistence.
 * 
 * Procedure: 
 * - Logs all user actions, system events, and performance metrics
 * - Encrypts sensitive data before storage
 * - Provides query utilities for debugging and analytics
 * 
 * Conclusion: Enables comprehensive observability and debugging capabilities
 */

import { encrypt, decrypt, generateSalt } from './CryptoService.js';

/**
 * @typedef {Object} ExecutionLog
 * @property {string} id - Unique log identifier
 * @property {number} timestamp - Unix timestamp
 * @property {string} type - Event type (e.g., 'rule.triggered', 'simulation.run')
 * @property {Object} payload - Event data
 * @property {'info' | 'warn' | 'error'} severity - Log severity level
 * @property {string} userId - User identifier
 * @property {string} sessionId - Session identifier
 * @property {Object} meta - Additional metadata
 * @property {string} meta.component - Component name
 * @property {string} meta.action - Action performed
 * @property {number} [meta.durationMs] - Duration in milliseconds
 */

class ExecutionLogService {
  constructor() {
    this.dbName = 'AlphaProLogs';
    this.storeName = 'executionLogs';
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.encryptionKey = null;
    this.db = null;
    
    // Initialize async operations with error handling
    this.initDatabase().catch(error => {
      console.error('Failed to initialize database:', error);
    });
    
    this.initEncryption().catch(error => {
      console.error('Failed to initialize encryption:', error);
    });
  }

  /**
   * Initialize encryption key
   */
  async initEncryption() {
    try {
      // Generate a salt and derive a key from a default password
      // In a real app, this would come from user authentication
      const salt = await generateSalt();
      const defaultPassword = 'alphapro-default-key';
      this.encryptionKey = salt; // Simplified for demo - in real app use proper key derivation
    } catch (error) {
      console.error('Failed to initialize encryption:', error);
      this.encryptionKey = 'fallback-key';
    }
  }

  /**
   * Initialize IndexedDB for log storage
   */
  async initDatabase() {
    // Check if we're in a Node environment (for testing)
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
      console.warn('IndexedDB not available - running in Node environment');
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('severity', 'severity', { unique: false });
          store.createIndex('sessionId', 'sessionId', { unique: false });
        }
      };
    });
  }

  /**
   * Log an event with structured schema
   * @param {string} type - Event type (e.g., 'rule.triggered', 'simulation.run')
   * @param {object} payload - Event data
   * @param {string} severity - Log severity level
   * @param {object} meta - Additional metadata
   */
  async log(type, payload = {}, severity = 'info', meta = {}) {
    const logEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      type,
      payload,
      severity,
      userId: this.userId,
      sessionId: this.sessionId,
      meta: {
        component: meta.component || 'unknown',
        action: meta.action || 'unknown',
        durationMs: meta.durationMs,
        ...meta
      }
    };

    // Encrypt sensitive payload data
    const encryptedPayload = await this.encryptPayload(payload);
    logEntry.payload = encryptedPayload;

    // Store in IndexedDB
    await this.storeLog(logEntry);

    // Emit to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${severity.toUpperCase()}] ${type}:`, payload);
    }

    return logEntry;
  }

  /**
   * Encrypt payload data using AES-256-GCM
   */
  async encryptPayload(payload) {
    try {
      const payloadString = JSON.stringify(payload);
      if (!this.encryptionKey) {
        // In Node environment, use a fallback key for testing
        this.encryptionKey = 'test-key';
      }
      return await encrypt(payloadString, this.encryptionKey);
    } catch (error) {
      console.error('Failed to encrypt log payload:', error);
      return { error: 'encryption_failed', original: payload };
    }
  }

  /**
   * Store log entry in IndexedDB
   */
  async storeLog(logEntry) {
    // Check if we're in a Node environment (for testing)
    if (typeof window === 'undefined' || !this.db) {
      console.warn('IndexedDB not available - skipping log storage');
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(logEntry);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Query logs by various criteria
   */
  async queryLogs(filters = {}) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        let logs = request.result;
        
        // Apply filters
        if (filters.type) {
          logs = logs.filter(log => log.type === filters.type);
        }
        if (filters.severity) {
          logs = logs.filter(log => log.severity === filters.severity);
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
        
        resolve(logs);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get logs by session
   */
  async getSessionLogs(sessionId = this.sessionId) {
    return this.queryLogs({ sessionId });
  }

  /**
   * Get logs by component
   */
  async getComponentLogs(component) {
    const logs = await this.queryLogs();
    return logs.filter(log => log.meta.component === component);
  }

  /**
   * Get performance logs (logs with durationMs)
   */
  async getPerformanceLogs() {
    const logs = await this.queryLogs();
    return logs.filter(log => log.meta.durationMs !== undefined);
  }

  /**
   * Clear old logs (older than specified days)
   */
  async clearOldLogs(daysOld = 30) {
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    const logs = await this.queryLogs();
    const logsToDelete = logs.filter(log => log.timestamp < cutoffTime);
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      let deletedCount = 0;
      logsToDelete.forEach(log => {
        const request = store.delete(log.id);
        request.onsuccess = () => deletedCount++;
      });
      
      transaction.oncomplete = () => resolve(deletedCount);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * Export logs for debugging
   */
  async exportLogs(filters = {}) {
    const logs = await this.queryLogs(filters);
    const processedLogs = [];
    
    for (const log of logs) {
      try {
        const decryptedPayload = await this.decryptPayload(log.payload);
        processedLogs.push({
          ...log,
          payload: decryptedPayload
        });
      } catch (error) {
        // Handle decryption errors gracefully
        processedLogs.push({
          ...log,
          payload: { error: 'decryption_failed', encrypted: log.payload }
        });
      }
    }
    
    return {
      exportTime: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      logs: processedLogs
    };
  }

  /**
   * Decrypt payload data
   */
  async decryptPayload(encryptedPayload) {
    try {
      if (encryptedPayload.error === 'encryption_failed') {
        return encryptedPayload.original;
      }
      if (!this.encryptionKey) {
        // In Node environment, use a fallback key for testing
        this.encryptionKey = 'test-key';
      }
      const decrypted = await decrypt(encryptedPayload, this.encryptionKey);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to decrypt log payload:', error);
      return { error: 'decryption_failed', encrypted: encryptedPayload };
    }
  }

  // Utility methods
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get user ID from localStorage or return anonymous
   */
  getUserId() {
    // Check if we're in a Node environment (for testing)
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return 'anonymous';
    }
    
    return localStorage.getItem('userId') || 'anonymous';
  }

  // Convenience methods for common log types
  async logRuleTriggered(ruleId, action, meta = {}) {
    return this.log('rule.triggered', { ruleId, action }, 'info', {
      component: 'RuleEngine',
      action: 'trigger',
      ...meta
    });
  }

  async logSimulationRun(simulationId, durationMs, meta = {}) {
    return this.log('simulation.run', { simulationId }, 'info', {
      component: 'TimelineSimulator',
      action: 'simulate',
      durationMs,
      ...meta
    });
  }

  async logBudgetForecast(forecastId, durationMs, meta = {}) {
    return this.log('budget.forecast.generated', { forecastId }, 'info', {
      component: 'BudgetService',
      action: 'forecast',
      durationMs,
      ...meta
    });
  }

  async logPortfolioAnalysis(portfolioId, durationMs, meta = {}) {
    return this.log('portfolio.analysis.completed', { portfolioId }, 'info', {
      component: 'PortfolioAnalyzer',
      action: 'analyze',
      durationMs,
      ...meta
    });
  }

  async logError(error, component, action, meta = {}) {
    return this.log('error.occurred', { 
      message: error.message, 
      stack: error.stack 
    }, 'error', {
      component,
      action,
      ...meta
    });
  }
}

// Export singleton instance
export const executionLogService = new ExecutionLogService();

// Export for direct use
export default executionLogService; 