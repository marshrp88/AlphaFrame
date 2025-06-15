/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the API call was successful
 * @property {any} data - The response data
 * @property {string} [error] - Error message if any
 * @property {number} [statusCode] - HTTP status code
 */

/**
 * @typedef {Object} ErrorState
 * @property {string} code - Error code
 * @property {string} message - Error message
 * @property {string} [details] - Additional error details
 * @property {Date} timestamp - When the error occurred
 */

/**
 * @typedef {Object} ServiceConfig
 * @property {string} name - Service name
 * @property {Object} settings - Service-specific settings
 * @property {boolean} enabled - Whether the service is enabled
 * @property {string} [version] - Service version
 */

/**
 * @typedef {Object} CryptoConfig
 * @property {string} algorithm - Encryption algorithm
 * @property {number} keyLength - Key length in bits
 * @property {number} iterations - Number of PBKDF2 iterations
 */

/**
 * @typedef {Object} SyncConfig
 * @property {string} provider - Sync provider (e.g., 'plaid')
 * @property {Object} credentials - Provider credentials
 * @property {number} syncInterval - Sync interval in minutes
 * @property {string[]} [excludedAccounts] - Accounts to exclude from sync
 */

/**
 * @typedef {Object} RuleConfig
 * @property {string} type - Rule type (e.g., 'alert', 'automation')
 * @property {Object} conditions - Rule conditions
 * @property {Object} actions - Rule actions
 * @property {boolean} enabled - Whether the rule is enabled
 */

/**
 * @typedef {Object} SimulationConfig
 * @property {string} model - Simulation model type
 * @property {Object} parameters - Model parameters
 * @property {number} timeframe - Simulation timeframe in months
 * @property {string[]} [scenarios] - Scenario names to include
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id - Transaction ID
 * @property {number} amount - Transaction amount
 * @property {string} description - Transaction description
 * @property {Date} date - Transaction date
 * @property {string} category - Transaction category
 * @property {string} accountId - Associated account ID
 */

/**
 * @typedef {Object} Account
 * @property {string} id - Account ID
 * @property {string} name - Account name
 * @property {string} type - Account type
 * @property {number} balance - Current balance
 * @property {string} currency - Account currency
 */

/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} name - User name
 * @property {Object} preferences - User preferences
 * @property {Date} createdAt - Account creation date
 */

// Export all types
export {
  ApiResponse,
  ErrorState,
  ServiceConfig,
  CryptoConfig,
  SyncConfig,
  RuleConfig,
  SimulationConfig,
  Transaction,
  Account,
  User
}; 