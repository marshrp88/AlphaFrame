/**
 * Execution Log Service - Tracks and manages rule execution history
 * 
 * Purpose: Records all financial automation rule executions for audit and debugging
 * Procedure: Logs execution events, results, and metadata for each rule run
 * Conclusion: Provides comprehensive audit trail and debugging capabilities
 */
class ExecutionLogService {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000; // Keep last 1000 logs
  }

  /**
   * Log an execution event
   */
  logExecution(ruleId, action, result, metadata = {}) {
    const logEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ruleId,
      action,
      result,
      metadata,
      timestamp: new Date(),
      status: result.success ? 'success' : 'failed',
    };

    this.logs.push(logEntry);
    
    // Maintain log size limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    return logEntry.id;
  }

  /**
   * Get execution logs with optional filtering
   */
  getLogs(filters = {}) {
    let filteredLogs = [...this.logs];

    if (filters.ruleId) {
      filteredLogs = filteredLogs.filter(log => log.ruleId === filters.ruleId);
    }

    if (filters.status) {
      filteredLogs = filteredLogs.filter(log => log.status === filters.status);
    }

    if (filters.since) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.since);
    }

    return filteredLogs.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get a specific log entry
   */
  getLog(logId) {
    return this.logs.find(log => log.id === logId);
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Get execution statistics
   */
  getStats() {
    const total = this.logs.length;
    const successful = this.logs.filter(log => log.status === 'success').length;
    const failed = total - successful;

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0,
    };
  }
}

// Export singleton instance
const executionLogService = new ExecutionLogService();
export default executionLogService;
export { ExecutionLogService }; 