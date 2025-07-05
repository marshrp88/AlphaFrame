/**
 * Mock use-toast for Jest tests
 */

export const useToast = () => ({
  toast: vi.fn(),
  dismiss: vi.fn(),
  toasts: []
});

export const ToastProvider = ({ children }) => children;

export const toast = vi.fn(); 