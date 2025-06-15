/**
 * @typedef {Object} Transaction
 * @property {string} id - Unique identifier for the transaction
 * @property {string} accountId - ID of the account this transaction belongs to
 * @property {number} amount - Transaction amount (positive for credits, negative for debits)
 * @property {string} description - Transaction description
 * @property {string} category - Transaction category
 * @property {string} merchant - Merchant name
 * @property {Date} date - Transaction date
 * @property {boolean} isPending - Whether the transaction is pending
 * @property {Object} metadata - Additional transaction metadata
 */

/**
 * @typedef {Object} Account
 * @property {string} id - Unique identifier for the account
 * @property {string} name - Account name
 * @property {string} type - Account type (checking, savings, investment, etc.)
 * @property {string} institution - Financial institution name
 * @property {number} balance - Current account balance
 * @property {string} currency - Account currency
 * @property {boolean} isActive - Whether the account is active
 * @property {Object} metadata - Additional account metadata
 */

/**
 * @typedef {Object} Rule
 * @property {string} id - Unique identifier for the rule
 * @property {string} name - Rule name
 * @property {string} description - Rule description
 * @property {Object} condition - Rule condition object
 * @property {Object} action - Rule action object
 * @property {boolean} isActive - Whether the rule is active
 * @property {Date} createdAt - Rule creation date
 * @property {Date} updatedAt - Rule last update date
 */

/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier for the user
 * @property {string} email - User's email address
 * @property {string} name - User's full name
 * @property {boolean} isVerified - Whether the user's email is verified
 * @property {Date} createdAt - Account creation date
 * @property {Date} lastLogin - Last login date
 */

// Export types for use in JSDoc comments
export const types = {
  Transaction: /** @type {Transaction} */ ({}),
  Account: /** @type {Account} */ ({}),
  Rule: /** @type {Rule} */ ({}),
  User: /** @type {User} */ ({})
}; 