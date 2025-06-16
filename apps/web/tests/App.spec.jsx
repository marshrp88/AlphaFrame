import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';
import * as configModule from '../src/lib/config'; // Import the module to spy on it.

// 1. Refactor the mock to be more controllable.
// Instead of a static object, we provide a getter for the `config` export.
// This allows us to spy on the getter and control its return value in each test.
vi.mock('../src/lib/config', async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    // The key change: export `config` as a getter.
    get config() {
      // This getter will be spied upon and replaced by our tests.
      return { apiUrl: 'https://api.default-mock.com' };
    },
  };
});

describe('App Integration Tests', () => {

  afterEach(() => {
    // Restore all mocks after each test for perfect isolation.
    vi.restoreAllMocks();
  });

  it('should render the success state when API fetch is successful', async () => {
    // 2. Control the mock's return value for THIS test.
    // We spy on the 'config' getter and make it return our desired value.
    const mockConfig = { apiUrl: 'https://api.success.com' };
    vi.spyOn(configModule, 'config', 'get').mockReturnValue(mockConfig);

    // Mock fetch for the success case.
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'API fetch successful!' }),
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(mockConfig.apiUrl);
      expect(screen.getByText(/API Test:/)).toBeInTheDocument();
      expect(screen.getByText(/API fetch successful!/)).toBeInTheDocument();
    });
  });

  it('should render the error state when API fetch fails', async () => {
    // Control the mock's return value for THIS test.
    const mockConfig = { apiUrl: 'https://api.error.com' };
    vi.spyOn(configModule, 'config', 'get').mockReturnValue(mockConfig);

    // Mock fetch for the failure case.
    global.fetch = vi.fn().mockRejectedValue(new Error('Network failure'));

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error: Network failure')).toBeInTheDocument();
    });
  });

  it('should render a warning if the API URL is not configured', async () => {
    // Control the mock's return value for THIS test.
    const mockConfig = { apiUrl: undefined };
    vi.spyOn(configModule, 'config', 'get').mockReturnValue(mockConfig);

    // No fetch mock is needed here.
    global.fetch = vi.fn();

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Assert the warning is rendered and fetch is never called.
    expect(screen.getByText('Not set! Please define VITE_PUBLIC_API_URL in your .env file.')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });
}); 