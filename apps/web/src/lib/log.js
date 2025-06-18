// log.js
// Simple log service stub for AlphaPro scaffolding

/**
 * log.info - Logs informational messages
 * log.warn - Logs warning messages
 * log.error - Logs error messages
 * Each function wraps console.log with a formatted prefix.
 */
export const log = {
  info: (...args) => console.log('[INFO]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
};

// Notes:
// - This stub can be replaced with a more advanced logger in the future.
// - All functions are easy to use and understand for a 10th-grade reader. 