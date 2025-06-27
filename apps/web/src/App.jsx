/**
 * App.jsx - AlphaFrame VX.1 Finalization with Performance Optimization
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
 * 6. Implement lazy loading for performance optimization
 * 
 * Conclusion: Central application component that orchestrates
 * all user flows and ensures robust error handling with optimal performance.
 */

import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { usePlaidLink } from 'react-plaid-link';
import LoginButton from "./components/LoginButton.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { ToastProvider } from "./components/ui/use-toast.jsx";
import { config } from "./lib/config.js";
import LiveFinancialDashboard from './components/dashboard/LiveFinancialDashboard';
import Dashboard2 from './components/dashboard/Dashboard2.jsx';
import OnboardingFlow from './features/onboarding/OnboardingFlow.jsx';

// Import design system components
import NavBar from "./components/ui/NavBar.jsx";
import StyledButton from "./components/ui/StyledButton.jsx";
import CompositeCard from "./components/ui/CompositeCard.jsx";
import DarkModeToggle from "./components/ui/DarkModeToggle.jsx";
import PerformanceMonitor from "./components/ui/PerformanceMonitor.jsx";

// Import styles
import "./App.css";

// Lazy load pages for performance optimization
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const AlphaPro = lazy(() => import('./pages/AlphaPro.jsx'));
const RulesPage = lazy(() => import('./pages/RulesPage.jsx'));
const TestMount = lazy(() => import('./pages/TestMount.jsx'));

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="page-loader">
    <div className="loader-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Navigation component with performance optimizations
const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth0();

  const navigationItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/rules', label: 'Rules', icon: '⚙️' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/profile', label: 'Profile', icon: '👤' }
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
          
          <NavBar items={navigationItems} currentPath={location.pathname} />
          
          <div className="navbar-actions">
            <DarkModeToggle />
            {isAuthenticated ? (
              <StyledButton variant="secondary" size="sm">
                <span className="user-avatar">👤</span>
                <span className="user-name">{user?.name || 'Account'}</span>
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

// Main App component with performance optimizations
const App = () => {
  const { isLoading, error } = useAuth0();

  // Show loading state
  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="loader-spinner"></div>
          <h2>Loading AlphaFrame</h2>
          <p>Please wait while we initialize your experience...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="app-error">
        <div className="error-container">
          <h2>Authentication Error</h2>
          <p>{error.message}</p>
          <StyledButton onClick={() => window.location.reload()}>
            Retry
          </StyledButton>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <div className="app">
            <Navigation />
            
            <main className="app-main">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <PrivateRoute>
                        <Dashboard2 />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/rules" 
                    element={
                      <PrivateRoute>
                        <RulesPage />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/alphapro" 
                    element={
                      <PrivateRoute>
                        <AlphaPro />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/test" 
                    element={
                      <PrivateRoute>
                        <TestMount />
                      </PrivateRoute>
                    } 
                  />
                  
                  {/* Onboarding Route */}
                  <Route 
                    path="/onboarding" 
                    element={
                      <PrivateRoute>
                        <OnboardingFlow />
                      </PrivateRoute>
                    } 
                  />
                  
                  {/* 404 Route */}
                  <Route 
                    path="*" 
                    element={
                      <div className="not-found">
                        <CompositeCard>
                          <h1>Page Not Found</h1>
                          <p>The page you're looking for doesn't exist.</p>
                          <StyledButton onClick={() => window.history.back()}>
                            Go Back
                          </StyledButton>
                        </CompositeCard>
                      </div>
                    } 
                  />
                </Routes>
              </Suspense>
            </main>
            
            {/* Development Performance Monitor */}
            <PerformanceMonitor />
          </div>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
