import { vi } from 'vitest';

const FeedbackUploader = {
  generateSnapshot: vi.fn().mockResolvedValue({ snapshot: 'mockSnapshot' }),
  exportSnapshot: vi.fn().mockResolvedValue({ success: true }),
  exportToClipboard: vi.fn().mockResolvedValue({ success: true }),
  upload: vi.fn().mockResolvedValue({ success: true, url: 'mock-url' }),
  sanitizeData: vi.fn().mockReturnValue({ sanitized: true }),
  generateFinancialSummary: vi.fn().mockReturnValue({ summary: 'mock-summary' }),
  collectUIPreferences: vi.fn().mockReturnValue({ theme: 'dark' }),
  collectPerformanceMetrics: vi.fn().mockReturnValue({ loadTime: 1000 }),
  validateSnapshot: vi.fn().mockReturnValue({ valid: true }),
  calculateStatistics: vi.fn().mockReturnValue({ count: 10 })
};

// Make all methods spyable
Object.keys(FeedbackUploader).forEach(key => {
  if (typeof FeedbackUploader[key] === 'function') {
    FeedbackUploader[key] = vi.fn(FeedbackUploader[key]);
  }
});

export default FeedbackUploader;
export { FeedbackUploader }; 