// Jest-safe environment abstraction
export const env = {
  NODE_ENV: process.env.NODE_ENV,
  VITE_PLAID_ENV: process.env.VITE_PLAID_ENV,
  VITE_API_HOST: process.env.VITE_API_HOST,
  // Add any other needed env vars here
}; 