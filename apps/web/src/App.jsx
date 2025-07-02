/**
 * App.jsx - STUBBED FOR MVEP PHASE 0
 * 
 * TODO [MVEP_PHASE_1]:
 * This module is currently stubbed and non-functional.
 * Real authentication will be implemented in Phase 1 of the MVEP rebuild plan.
 * 
 * Purpose: Will provide main application component with routing, authentication,
 * onboarding flow, and error boundaries for production readiness.
 * 
 * Current Status: Auth0 removed, using stubbed authentication
 */

import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { ToastProvider } from "./components/ui/use-toast.jsx";
import { config } from '@/lib/config.js';
import DemoModeBanner from './components/ui/DemoModeBanner';
import FeedbackButton from './components/ui/FeedbackButton.jsx';
import SoftLaunchBanner from './components/ui/SoftLaunchBanner.jsx';
import UserStateSnapshot from './components/ui/UserStateSnapshot.jsx';

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
import TrustPage from './pages/TrustPage.jsx';

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

// Stubbed authentication hook for Phase 0
const useStubbedAuth = () => {
  return {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    error: null,
    loginWithRedirect: () => {
      throw new Error("Authentication not yet implemented. This will be added in Phase 1 of the MVEP rebuild.");
    },
    logout: () => {
      throw new Error("Authentication not yet implemented. This will be added in Phase 1 of the MVEP rebuild.");
    }
  };
};

// Navigation component with performance optimizations
const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useStubbedAuth();

  const navigationItems = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/rules', label: 'Rules' },
    { to: '/settings', label: 'Settings' },
    { to: '/about', label: 'About' },
    { to: '/profile', label: 'Profile' },
    { to: '/onboarding', label: 'Onboarding' },
    // TODO [MVEP_PHASE_5]: Re-enable upgrade route when monetization is implemented
    // { to: '/upgrade', label: 'Upgrade' },
    { to: '/trust', label: '🔒 Trust', icon: '🔒' }
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
              <StyledButton 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  throw new Error("Authentication not yet implemented. This will be added in Phase 1 of the MVEP rebuild.");
                }}
              >
                Login (Not Implemented)
              </StyledButton>
            )}
          </div>
        </div>
      </CompositeCard>
    </header>
  );
};

// Move all logic that uses useNavigate into AppContent
const AppContent = () => {
  const { isLoading, error } = useStubbedAuth();
  const navigate = useNavigate();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

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
      <SoftLaunchBanner />
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
            {/* TODO [MVEP_PHASE_5]: Re-enable upgrade route when monetization is implemented */}
            {/* <Route path="/upgrade" element={<UpgradePage />} /> */}
            <Route path="/alphapro" element={<AlphaPro />} />
            <Route path="/trust" element={<TrustPage />} />
            <Route path="/test" element={<TestMount />} />
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      {/* Galileo Initiative Feedback Button */}
      <FeedbackButton />
      {/* User State Snapshot */}
      <UserStateSnapshot onFeedbackClick={() => setFeedbackModalOpen(true)} />
      {/* Development Performance Monitor */}
      <PerformanceMonitor />
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <ToastProvider>
      <Router>
        <AppContent />
      </Router>
    </ToastProvider>
  </ErrorBoundary>
);

export default App;
