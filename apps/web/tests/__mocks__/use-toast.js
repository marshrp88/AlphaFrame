/**
 * Mock use-toast for Jest tests
 */

export const useToast = () => ({
  toast: jest.fn(),
  dismiss: jest.fn(),
  toasts: []
});

export const ToastProvider = ({ children }) => children;

export const toast = jest.fn(); 