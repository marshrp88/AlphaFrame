import { vi } from 'vitest';

export const applyAllMocks = () => {
  // Core Services
  vi.mock('@/core/services/CryptoService', async () => {
    return await import('../../__mocks__/core/services/CryptoService');
  });

  // Lib Services
  vi.mock('@/lib/services/AuthService', async () => {
    return await import('../../__mocks__/lib/services/AuthService');
  });

  vi.mock('@/lib/services/PlaidService', async () => {
    return await import('../../__mocks__/lib/services/PlaidService');
  });

  vi.mock('@/lib/services/FeedbackUploader', async () => {
    return await import('../../__mocks__/lib/services/FeedbackUploader');
  });

  // Stores
  vi.mock('@/core/store/useAppStore', async () => {
    return await import('../../__mocks__/store/useAppStore');
  });

  vi.mock('@/core/store/uiStore', async () => {
    return await import('../../__mocks__/store/uiStore');
  });

  vi.mock('@/lib/store/financialStateStore', async () => {
    return await import('../../__mocks__/store/financialStateStore');
  });

  // UI Components
  vi.mock('@/shared/ui/Input', async () => {
    return await import('../../__mocks__/shared/ui/Input');
  });
}; 