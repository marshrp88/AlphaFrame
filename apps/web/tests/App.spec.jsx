// CLUSTER 1 FIX: Add test-local Auth0 mock BEFORE imports to prevent hanging
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(() => ({ 
    isAuthenticated: true, 
    user: { name: 'Test User' }, 
    logout: vi.fn(),
    isLoading: false,
    error: null
  })),
  Auth0Provider: ({ children }) => children,
  withAuthenticationRequired: (component) => component
}));

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';
import * as configModule from '../src/lib/config';

// Mock the config module
vi.mock('../src/lib/config', async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    get config() {
      return { apiUrl: 'https://api.default-mock.com', env: 'test' };
    },
  };
});

describe('App Integration Tests', () => {

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the home page successfully', async () => {
    // Mock config for this test
    const mockConfig = { apiUrl: 'https://api.success.com', env: 'test' };
    vi.spyOn(configModule, 'config', 'get').mockReturnValue(mockConfig);

    render(<App />);

    // Wait for the home page to render with longer timeout
    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    }, 10000);

    // Verify navigation elements are present
    expect(screen.getByText('AlphaFrame VX.1')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  }, 15000);

  it('should render the app with proper navigation structure', async () => {
    const mockConfig = { apiUrl: 'https://api.test.com', env: 'test' };
    vi.spyOn(configModule, 'config', 'get').mockReturnValue(mockConfig);

    render(<App />);

    // Verify the app structure with longer timeout
    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    }, 10000);

    // Check for navigation elements
    expect(screen.getByText('AlphaFrame VX.1')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    
    // Check for footer
    expect(screen.getByText(/© 2024 AlphaFrame/)).toBeInTheDocument();
    expect(screen.getByText(/Environment: test/)).toBeInTheDocument();
  }, 15000);

  it('should handle authentication state properly', async () => {
    const mockConfig = { apiUrl: undefined, env: 'test' };
    vi.spyOn(configModule, 'config', 'get').mockReturnValue(mockConfig);

    render(<App />);

    // Verify the app renders the home page regardless of API URL config
    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    }, 10000);
    
    // Verify authentication-dependent elements are present (since we mock isAuthenticated: true)
    expect(screen.getByText('AlphaPro')).toBeInTheDocument();
    expect(screen.getByText('Rules')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  }, 15000);
}); 
