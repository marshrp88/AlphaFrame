import { vi } from 'vitest';

export const applyAllMocks = () => {
  vi.mock('src/core/services/CryptoService', async () => {
    return await import('../../__mocks__/core/services/CryptoService');
  });
  vi.mock('src/lib/services/AuthService', async () => {
    return await import('../../__mocks__/lib/services/AuthService');
  });
  vi.mock('src/lib/services/PlaidService', async () => {
    return await import('../../__mocks__/lib/services/PlaidService');
  });
  vi.mock('src/lib/services/FeedbackUploader', async () => {
    return await import('../../__mocks__/lib/services/FeedbackUploader');
  });
  vi.mock('src/store/useAppStore', async () => {
    return await import('../../__mocks__/store/useAppStore');
  });
  vi.mock('src/shared/ui/Input', async () => {
    return await import('../../__mocks__/shared/ui/Input');
  });
}; 