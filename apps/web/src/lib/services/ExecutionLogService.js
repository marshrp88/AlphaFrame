/**
 * Execution Log Service for logging application events
 */

class ExecutionLogService {
  constructor() {
    this.logs = [];
  }

  async logInfo(message, data = {}) {
    const logEntry = {
      level: 'info',
      message,
      data,
      timestamp: new Date().toISOString()
    };
    this.logs.push(logEntry);
    return logEntry;
  }

  async logError(message, error, data = {}) {
    const logEntry = {
      level: 'error',
      message,
      error: error?.message || error,
      data,
      timestamp: new Date().toISOString()
    };
    this.logs.push(logEntry);
    return logEntry;
  }

  async logWarning(message, data = {}) {
    const logEntry = {
      level: 'warning',
      message,
      data,
      timestamp: new Date().toISOString()
    };
    this.logs.push(logEntry);
    return logEntry;
  }

  async getLogs(level = null, limit = 100) {
    let filteredLogs = this.logs;
    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level);
    }
    return filteredLogs.slice(-limit);
  }

  async clearLogs() {
    this.logs = [];
  }
}

export default new ExecutionLogService(); 