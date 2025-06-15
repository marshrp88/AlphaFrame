import { it, expect, vi } from 'vitest';

it('can import the App component with a mocked config', async () => {
  vi.doMock('../src/lib/config', () => ({
    config: { apiUrl: 'mocked-url' },
  }));

  // Try to import the App component
  const { default: App } = await import('../src/App');
  expect(typeof App).toBe('function');
}); 