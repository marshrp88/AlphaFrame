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

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { usePlaidLink } from 'react-plaid-link';
import LoginButton from "./components/LoginButton.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Profile from "./pages/Profile.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import AlphaPro from "./pages/AlphaPro.jsx";
import RulesPage from "./pages/RulesPage.jsx";
import TestMount from "./pages/TestMount.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { ToastProvider } from "./components/ui/use-toast.jsx";
import { config } from "./lib/config.js";

// Debug Router Logger to trace all route matches
function DebugRouterLogger() {
  const location = useLocation();
  React.useEffect(() => {
    // console.log('[Router Debug] Current pathname:', location.pathname);
    // console.log('[Router Debug] Full location:', location);
  }, [location]);
  return null;
}

const PlaidLink = () => {
  // TODO: This token must be fetched from your own backend server.
  const linkToken = null; 

  const onSuccess = React.useCallback(() => {
    // console.log("Plaid success");
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return (
    <button 
      onClick={() => open()} 
      disabled={!ready || !linkToken}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
    >
      Connect a bank account
    </button>
  );
};

const Navigation = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-900">
              AlphaFrame VX.1
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/alphapro" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    AlphaPro
                  </Link>
                  <Link to="/rules" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Rules
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <Link to="/profile" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Profile
              </Link>
            )}
            <LoginButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  const { isLoading } = useAuth0();
  const isTestMode = import.meta.env.VITE_APP_ENV === 'test';

  // console.log("[App] Loaded in test mode:", isTestMode);
  // console.log("[App] RulesPage import:", typeof RulesPage);
  // console.log("[App] Full routing table being configured");

  if (isLoading && !isTestMode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading AlphaFrame...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <DebugRouterLogger />
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            
            <main className="py-8">
              {(() => {
                try {
                  return (
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/test-mount" element={<TestMount />} />
                      
                      {/* Protected Routes */}
                      <Route 
                        path="/profile" 
                        element={
                          isTestMode ? <Profile /> : (
                            <PrivateRoute>
                              <Profile />
                            </PrivateRoute>
                          )
                        } 
                      />
                      
                      <Route 
                        path="/alphapro" 
                        element={
                          isTestMode ? <AlphaPro /> : (
                            <PrivateRoute requiredRoles={['premium', 'admin']}>
                              <AlphaPro />
                            </PrivateRoute>
                          )
                        } 
                      />
                      
                      {/* RULES ROUTE - Direct mount without lazy loading or conditional guards */}
                      <Route 
                        path="/rules" 
                        element={
                          (() => {
                            // console.log("[Router Debug] /rules route matched, isTestMode:", isTestMode);
                            // console.log("[Router Debug] About to render RulesPage directly");
                            return <RulesPage />; // Direct mount - no lazy, no Suspense, no conditional guards
                          })()
                        } 
                      />
                      
                      {/* 404 Route */}
                      <Route 
                        path="*" 
                        element={
                          <div className="flex items-center justify-center min-h-screen">
                            <div className="text-center">
                              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                              <p className="text-gray-600 mb-4">Page not found</p>
                              <Link 
                                to="/" 
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                Go Home
                              </Link>
                            </div>
                          </div>
                        } 
                      />
                    </Routes>
                  );
                } catch (err) {
                  // console.error("Error in App routing:", err);
                  return (
                    <div>
                      <span data-testid="app-routing-error">{err?.message || "Unknown routing error"}</span>
                      <pre>{err?.stack}</pre>
                    </div>
                  );
                }
              })()}
            </main>
            
            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-8">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center text-gray-600">
                  <p>&copy; 2024 AlphaFrame. All rights reserved.</p>
                  <p className="text-sm mt-2">
                    Environment: {config.env} | Version: 1.0.0
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
