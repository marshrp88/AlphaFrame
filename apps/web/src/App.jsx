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
import LiveFinancialDashboard from './components/dashboard/LiveFinancialDashboard';
import Dashboard2 from './components/dashboard/Dashboard2.jsx';

// Import design system components
import NavBar from "./components/ui/NavBar.jsx";
import StyledButton from "./components/ui/StyledButton.jsx";
import CompositeCard from "./components/ui/CompositeCard.jsx";

// Import styles
import "./App.css";

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
  const location = useLocation();

  const navigationItems = [
    { label: 'Home', to: '/', icon: '🏠' },
    { label: 'About', to: '/about', icon: 'ℹ️' },
    { label: 'Dashboard', to: '/live-dashboard', icon: '📊' },
    { label: 'Dashboard 2.0', to: '/dashboard2', icon: '🚀' },
    ...(isAuthenticated ? [
      { label: 'AlphaPro', to: '/alphapro', icon: '⭐' },
      { label: 'Rules', to: '/rules', icon: '⚙️' },
      { label: 'Profile', to: '/profile', icon: '👤' }
    ] : [])
  ];

  return (
    <header className="navbar-container">
      <CompositeCard variant="elevated" className="navbar-card">
        <div className="navbar-content">
          <div className="navbar-brand">
            <Link to="/" className="navbar-logo">
              <span className="navbar-logo-text">AlphaFrame</span>
              <span className="navbar-logo-version">VX.1</span>
            </Link>
          </div>
          
          <NavBar 
            items={navigationItems}
            currentPath={location.pathname}
            className="navbar-main"
          />
          
          <div className="navbar-actions">
            {isAuthenticated ? (
              <StyledButton variant="secondary" size="sm">
                <span className="user-avatar">👤</span>
                <span className="user-name">Account</span>
              </StyledButton>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </CompositeCard>
    </header>
  );
};

const App = () => {
  const { isLoading } = useAuth0();
  const isTestMode = import.meta.env.VITE_APP_ENV === 'test';

  if (isLoading && !isTestMode) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading AlphaFrame...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <DebugRouterLogger />
          <div className="app-wrapper">
            <Navigation />
            
            <main className="main-content">
              <div className="content-container">
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
                              return <RulesPage />; // Direct mount - no lazy, no Suspense, no conditional guards
                            })()
                          } 
                        />
                        
                        <Route path="/live-dashboard" element={<LiveFinancialDashboard />} />
                        <Route path="/dashboard2" element={<Dashboard2 />} />
                        
                        {/* 404 Route */}
                        <Route 
                          path="*" 
                          element={
                            <div className="error-page">
                              <CompositeCard variant="elevated" className="error-card">
                                <h1 className="error-title">404</h1>
                                <p className="error-message">Page not found</p>
                                <StyledButton as={Link} to="/" variant="primary">
                                  Go Home
                                </StyledButton>
                              </CompositeCard>
                            </div>
                          } 
                        />
                      </Routes>
                    );
                  } catch (err) {
                    return (
                      <div className="error-page">
                        <CompositeCard variant="elevated" className="error-card">
                          <h1 className="error-title">Application Error</h1>
                          <p className="error-message">{err?.message || "Unknown error occurred"}</p>
                          <pre className="error-details">{err?.stack}</pre>
                        </CompositeCard>
                      </div>
                    );
                  }
                })()}
              </div>
            </main>
          </div>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
