/**
 * FeedbackUploader.js
 * 
 * Purpose: Service for generating and exporting user-approved feedback snapshots
 * with encryption and privacy controls for the Pioneer Feedback Module.
 * 
 * Procedure:
 * 1. Generate encrypted snapshots from user-selected data
 * 2. Provide export functionality (download, clipboard)
 * 3. Maintain zero-knowledge compliance (no automatic upload)
 * 4. Log feedback activities for analytics
 * 5. Ensure data privacy and security
 * 
 * Conclusion: Provides secure, user-controlled feedback data export
 * while maintaining complete privacy and zero-knowledge compliance.
 */

import cryptoService from '../../core/services/CryptoService.js';
import executionLogService from '../../core/services/ExecutionLogService.js';
import budgetService from '../../features/pro/services/BudgetService.js';
import cashFlowService from '../../features/pro/services/CashFlowService.js';

class FeedbackUploader {
  constructor() {
    this.snapshotVersion = '1.0';
    this.encryptionKey = null;
  }

  /**
   * Generate a feedback snapshot with selected data
   * @param {Object} options - Snapshot generation options
   * @returns {Object} Encrypted snapshot data
   */
  async generateSnapshot(options) {
    try {
      const { category, feedback, includedData, timestamp } = options;
      
      // Collect data based on user selections
      const snapshotData = {
        version: this.snapshotVersion,
        timestamp,
        category,
        feedback,
        metadata: {
          generatedAt: new Date().toISOString(),
          dataSchemaVersion: 1,
          includedDataTypes: Object.keys(includedData).filter(key => includedData[key])
        },
        data: {}
      };

      // Collect execution logs if requested
      if (includedData.execution_logs) {
        const logs = await executionLogService.getLogs(24); // Last 24 hours
        snapshotData.data.executionLogs = this.sanitizeLogs(logs);
      }

      // Collect financial summary if requested
      if (includedData.financial_summary) {
        snapshotData.data.financialSummary = await this.generateFinancialSummary();
      }

      // Collect UI preferences if requested
      if (includedData.ui_preferences) {
        snapshotData.data.uiPreferences = this.collectUIPreferences();
      }

      // Collect error logs if requested
      if (includedData.error_logs) {
        const errorLogs = await executionLogService.getLogs(24, 'error');
        snapshotData.data.errorLogs = this.sanitizeLogs(errorLogs);
      }

      // Collect performance metrics if requested
      if (includedData.performance_metrics) {
        snapshotData.data.performanceMetrics = await this.collectPerformanceMetrics();
      }

      // Encrypt the snapshot data
      const encryptedSnapshot = await this.encryptSnapshot(snapshotData);

      // Log the snapshot creation
      await executionLogService.log('feedback.snapshot.generated', {
        category,
        dataTypes: snapshotData.metadata.includedDataTypes,
        size: JSON.stringify(snapshotData).length
      });

      return encryptedSnapshot;

    } catch (error) {
      await executionLogService.logError('feedback.snapshot.generation.failed', error, options);
      throw new Error('Failed to generate feedback snapshot');
    }
  }

  /**
   * Export snapshot to file or clipboard
   * @param {Object} snapshotData - Encrypted snapshot data
   * @param {string} format - Export format ('file' or 'clipboard')
   * @returns {Promise} Export result
   */
  async exportSnapshot(snapshotData, format = 'file') {
    try {
      const exportData = {
        ...snapshotData,
        exportInfo: {
          exportedAt: new Date().toISOString(),
          format,
          version: this.snapshotVersion
        }
      };

      if (format === 'file') {
        await this.downloadSnapshot(exportData);
      } else if (format === 'clipboard') {
        await this.copyToClipboard(exportData);
      }

      await executionLogService.log('feedback.snapshot.exported', {
        format,
        size: JSON.stringify(exportData).length
      });

      return { success: true, format };

    } catch (error) {
      await executionLogService.logError('feedback.snapshot.export.failed', error, { format });
      throw new Error(`Failed to export snapshot in ${format} format`);
    }
  }

  /**
   * Download snapshot as a file
   * @param {Object} snapshotData - Snapshot data to download
   */
  async downloadSnapshot(snapshotData) {
    const blob = new Blob([JSON.stringify(snapshotData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alphapro-feedback-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Copy snapshot to clipboard
   * @param {Object} snapshotData - Snapshot data to copy
   */
  async copyToClipboard(snapshotData) {
    const text = JSON.stringify(snapshotData, null, 2);
    await navigator.clipboard.writeText(text);
  }

  /**
   * Encrypt snapshot data
   * @param {Object} snapshotData - Raw snapshot data
   * @returns {Object} Encrypted snapshot
   */
  async encryptSnapshot(snapshotData) {
    try {
      const dataString = JSON.stringify(snapshotData);
      const encryptedData = await cryptoService.encrypt(dataString, 'feedback-snapshot');
      
      return {
        encrypted: true,
        data: encryptedData,
        metadata: {
          version: this.snapshotVersion,
          encryptedAt: new Date().toISOString(),
          algorithm: 'AES-256-GCM'
        }
      };

    } catch (error) {
      // Fallback to unencrypted if encryption fails
      return {
        encrypted: false,
        data: snapshotData,
        metadata: {
          version: this.snapshotVersion,
          encryptedAt: new Date().toISOString(),
          algorithm: 'none'
        }
      };
    }
  }

  /**
   * Sanitize logs to remove sensitive information
   * @param {Array} logs - Raw logs
   * @returns {Array} Sanitized logs
   */
  sanitizeLogs(logs) {
    return logs.map(log => ({
      type: log.type,
      timestamp: log.timestamp,
      // Remove sensitive payload data, keep only structure
      payload: this.sanitizePayload(log.payload)
    }));
  }

  /**
   * Sanitize payload to remove sensitive data
   * @param {Object} payload - Raw payload
   * @returns {Object} Sanitized payload
   */
  sanitizePayload(payload) {
    if (!payload) return null;

    const sanitized = { ...payload };
    
    // Remove sensitive fields
    const sensitiveFields = [
      'password', 'token', 'key', 'secret', 'private', 'personal',
      'account', 'bank', 'credit', 'ssn', 'email', 'phone'
    ];

    Object.keys(sanitized).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Generate financial summary without personal details
   * @returns {Object} Financial summary
   */
  async generateFinancialSummary() {
    try {
      const budgetSummary = budgetService.getBudgetSummary();
      const cashFlowSummary = cashFlowService.getCashFlowSummary();

      return {
        budget: {
          totalBudget: budgetSummary.totalBudget,
          categories: budgetSummary.categories,
          monthlyIncome: budgetSummary.monthlyIncome
        },
        cashFlow: {
          netCashFlow: cashFlowSummary.netCashFlow,
          income: cashFlowSummary.income,
          expenses: cashFlowSummary.expenses
        },
        // No personal account details or transaction history
        summary: {
          hasBudget: !!budgetSummary.totalBudget,
          hasCashFlow: !!cashFlowSummary.netCashFlow,
          dataPoints: (budgetSummary.categories || 0) + 2
        }
      };

    } catch (error) {
      return { error: 'Unable to generate financial summary' };
    }
  }

  /**
   * Collect UI preferences
   * @returns {Object} UI preferences
   */
  collectUIPreferences() {
    try {
      // Get preferences from localStorage
      const preferences = {
        dashboardMode: localStorage.getItem('dashboardMode') || 'PLANNER',
        theme: localStorage.getItem('theme') || 'light',
        language: localStorage.getItem('language') || 'en',
        notifications: localStorage.getItem('notifications') !== 'false',
        dataSchemaVersion: localStorage.getItem('dataSchemaVersion') || '1'
      };

      return preferences;

    } catch (error) {
      return { error: 'Unable to collect UI preferences' };
    }
  }

  /**
   * Collect performance metrics
   * @returns {Object} Performance metrics
   */
  async collectPerformanceMetrics() {
    try {
      const metrics = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        // Basic performance data
        performance: {
          memory: performance.memory ? {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
          } : null,
          timing: performance.timing ? {
            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
            domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
          } : null
        }
      };

      return metrics;

    } catch (error) {
      return { error: 'Unable to collect performance metrics' };
    }
  }

  /**
   * Validate snapshot data
   * @param {Object} snapshotData - Snapshot data to validate
   * @returns {boolean} Validation result
   */
  validateSnapshot(snapshotData) {
    try {
      if (!snapshotData || typeof snapshotData !== 'object') {
        return false;
      }

      const requiredFields = ['version', 'timestamp', 'category', 'feedback', 'metadata'];
      return requiredFields.every(field => Object.hasOwn(snapshotData, field));

    } catch (error) {
      return false;
    }
  }

  /**
   * Get snapshot statistics
   * @param {Object} snapshotData - Snapshot data
   * @returns {Object} Statistics
   */
  getSnapshotStats(snapshotData) {
    try {
      const dataString = JSON.stringify(snapshotData);
      return {
        size: dataString.length,
        sizeKB: Math.round(dataString.length / 1024 * 100) / 100,
        dataTypes: snapshotData.metadata?.includedDataTypes?.length || 0,
        timestamp: snapshotData.timestamp
      };

    } catch (error) {
      return { error: 'Unable to calculate statistics' };
    }
  }
}

// Export singleton instance
const feedbackUploader = new FeedbackUploader();
export default feedbackUploader;

// Also export the class for testing
export { FeedbackUploader }; 