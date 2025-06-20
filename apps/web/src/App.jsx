/**
 * App.jsx - AlphaFrame VX.1 Finalization
 * 
 * Purpose: Main application component with routing, authentication,
 * onboarding flow, and error boundaries for production readiness.
 * 
 * Procedure:
 * 1. Set up routing with protected and public routes
 * 2. Integrate onboarding flow for first-time users
 * 3. Wrap components with error boundaries
 * 4. Handle authentication state and redirects
 * 5. Provide navigation and user experience
 * 
 * Conclusion: Central application component that orchestrates
 * all user flows and ensures robust error handling.
 */

import React, { useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuthStore } from './core/store/authStore.js';
import { useFinancialStateStore } from './lib/store/financialStateStore.js';
import AlphaPro from './pages/AlphaPro';
import OnboardingFlow from './features/onboarding/OnboardingFlow.jsx';
import PrivateRoute from './components/PrivateRoute';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { SyncStatusWidget } from './features/status/SyncStatusWidget.jsx';

function App() {
  console.log('Debug: App component rendering');
  
  const { user, isAuthenticated, checkAuthStatus } = useAuthStore();
  const { isInitialized } = useFinancialStateStore();

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Show loading state while checking auth
  if (!isAuthenticated && user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div style={{ 
        backgroundColor: 'white',
        color: '#213547',
        minHeight: '100vh'
      }}>
        {/* Navigation */}
        <nav style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" style={{ color: '#646cff', fontWeight: 'bold' }}>
                AlphaFrame
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/alphapro" style={{ color: '#646cff' }}>
                    AlphaPro
                  </Link>
                  <Link to="/dashboard" style={{ color: '#646cff' }}>
                    Dashboard
                  </Link>
                </>
              )}
            </div>
            
            {/* User Status */}
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.name || user?.email || 'User'}
                </span>
                <button 
                  onClick={() => useAuthStore.getState().logout()}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex">
          {/* Sidebar with Sync Status */}
          {isAuthenticated && (
            <div className="w-64 p-4 border-r border-gray-200">
              <SyncStatusWidget />
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <div style={{ padding: '2rem' }}>
                  <h1>✅ AlphaFrame Home is Rendering</h1>
                  {!isAuthenticated && (
                    <div className="mt-4">
                      <p>Welcome to AlphaFrame - Your Financial Management Platform</p>
                      <button 
                        onClick={() => useAuthStore.getState().login()}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Get Started
                      </button>
                    </div>
                  )}
                </div>
              } />

              {/* Protected Routes */}
              <Route path="/alphapro" element={
                <PrivateRoute>
                  <AlphaPro />
                </PrivateRoute>
              } />

              {/* Onboarding Route */}
              <Route path="/onboarding" element={
                <PrivateRoute>
                  {user?.onboarded ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <OnboardingFlow />
                  )}
                </PrivateRoute>
              } />

              {/* Dashboard Route */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  {!user?.onboarded ? (
                    <Navigate to="/onboarding" replace />
                  ) : (
                    <div style={{ padding: '2rem' }}>
                      <h1>🎉 Welcome to AlphaFrame!</h1>
                      <p>Your financial dashboard is ready.</p>
                      <div className="mt-4">
                        <Link 
                          to="/alphapro" 
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Open AlphaPro
                        </Link>
                      </div>
                    </div>
                  )}
                </PrivateRoute>
              } />

              {/* Catch-all route */}
              <Route path="*" element={
                <div style={{ padding: '2rem' }}>
                  <h1>404 - Page Not Found</h1>
                  <Link to="/" style={{ color: '#646cff' }}>
                    Return to Home
                  </Link>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
