/**
 * Utility Functions - Common utility functions used throughout the application
 * 
 * Purpose: Provides reusable helper functions for common operations
 * Procedure: Exports utility functions for string manipulation, validation, and formatting
 * Conclusion: Reduces code duplication and provides consistent utility functions
 */

/**
 * Combines class names with conditional logic
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats currency values
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Formats dates consistently
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date));
}

/**
 * Debounces a function call
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
 * Validates email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Truncates text to specified length
 */
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
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
 * Capitalize first letter of string
 * 
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
} 
