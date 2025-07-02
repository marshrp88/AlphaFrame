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
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { usePlaidLink } from 'react-plaid-link';
import LoginButton from "./components/LoginButton.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { ToastProvider } from "./components/ui/use-toast.jsx";
import { config } from '@/lib/config.js';
import LiveFinancialDashboard from './components/dashboard/LiveFinancialDashboard';
import Dashboard2 from './components/dashboard/Dashboard2.jsx';
import OnboardingFlow from './features/onboarding/OnboardingFlow.jsx';
import { Auth0Provider } from '@auth0/auth0-react';
import DemoModeBanner from './components/ui/DemoModeBanner';

// Import design system components
import NavBar from "./components/ui/NavBar.jsx";
import StyledButton from "./components/ui/StyledButton.jsx";
import CompositeCard from "./components/ui/CompositeCard.jsx";
import DarkModeToggle from "./components/ui/DarkModeToggle.jsx";
import PerformanceMonitor from "./components/ui/PerformanceMonitor.jsx";

// Import new page shells for Phase 1
import DashboardPage from './pages/DashboardPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import UpgradePage from './pages/UpgradePage';
import About from './pages/About';
import AlphaPro from './pages/AlphaPro';

// Lazy load existing pages for performance optimization
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
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
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/rules', label: 'Rules' },
    { to: '/settings', label: 'Settings' },
    { to: '/about', label: 'About' },
    { to: '/profile', label: 'Profile' },
    { to: '/onboarding', label: 'Onboarding' },
    { to: '/upgrade', label: 'Upgrade' }
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

// Move all logic that uses useNavigate into AppContent
const AppContent = () => {
  const { isLoading, error } = useAuth0();
  const navigate = useNavigate();

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
          <StyledButton onClick={() => navigate(0)}>
            Retry
          </StyledButton>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <DemoModeBanner />
      <Navigation />
      <main className="app-main">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            {/* Protected Routes with new page shells */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/upgrade" element={<UpgradePage />} />
            <Route path="/alphapro" element={<AlphaPro />} />
            <Route path="/test" element={<TestMount />} />
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      {/* Development Performance Monitor */}
      <PerformanceMonitor />
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <ToastProvider>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN || 'dev-example.auth0.com'}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || 'your-client-id'}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: 'openid profile email'
        }}
      >
        <Router>
          <AppContent />
        </Router>
      </Auth0Provider>
    </ToastProvider>
  </ErrorBoundary>
);

export default App;
