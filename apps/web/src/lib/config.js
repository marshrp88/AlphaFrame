/**
 * A centralized module for accessing environment variables.
 * This provides a single source of truth for configuration
 * and a clean seam for mocking in tests.
 */
export const config = {
  apiUrl: import.meta.env.VITE_PUBLIC_API_URL,
}; 
