/**
 * AlphaFrame Utility Functions
 * 
 * Purpose: Common utility functions used across the AlphaFrame application
 * Procedure: Import these functions in components that need utility functionality
 * Conclusion: Provides consistent utility access without external dependencies
 */

/**
 * Utility function to merge class names with proper conflict resolution
 * Simple implementation without external dependencies
 * 
 * @param {...any} inputs - Class names to merge
 * @returns {string} - Merged class string
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Format currency values consistently across the application
 * 
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Format dates consistently across the application
 * 
 * @param {Date|string} date - Date to format
 * @param {string} format - Format style (short, long, relative)
 * @returns {string} - Formatted date string
 */
export function formatDate(date, format = 'short') {
  const dateObj = new Date(date);
  
  switch (format) {
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'relative':
      const now = new Date();
      const diffTime = Math.abs(now - dateObj);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Today';
      if (diffDays === 2) return 'Yesterday';
      if (diffDays <= 7) return `${diffDays - 1} days ago`;
      return dateObj.toLocaleDateString();
    default:
      return dateObj.toLocaleDateString();
  }
}

/**
 * Generate a unique ID for components and elements
 * 
 * @returns {string} - Unique ID string
 */
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Debounce function to limit the rate of function calls
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Validate email format
 * 
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Capitalize first letter of string
 * 
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate text to specified length
 * 
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated text
 */
export function truncate(text, length = 50) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
} 
