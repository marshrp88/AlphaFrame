/**
 * App.jsx - PHASE 2 IMPLEMENTATION
 * 
 * TODO [MVEP_PHASE_3]:
 * This module is currently using localStorage-based authentication and data persistence.
 * Will be upgraded to Firebase Auth and Firestore in Phase 3 for production scalability.
 * 
 * Purpose: Provides main application component with routing, authentication,
 * data initialization, onboarding flow, and error boundaries for production readiness.
 * 
 * Current Status: Working authentication and data layer with localStorage persistence
 */

import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { ToastProvider } from "./components/ui/use-toast.jsx";
import { config } from '@/lib/config.js';
import DemoModeBanner from './components/ui/DemoModeBanner';
import FeedbackButton from './components/ui/FeedbackButton.jsx';
import SoftLaunchBanner from './components/ui/SoftLaunchBanner.jsx';
import UserStateSnapshot from './components/ui/UserStateSnapshot.jsx';
import { useAuthStore } from './core/store/authStore.js';
import { useDataStore } from './core/store/dataStore.js';

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

// Authentication component
const AuthComponent = () => {
  const { user, isAuthenticated, isLoading, error, login, logout, register } = useAuthStore();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [authData, setAuthData] = useState({ email: '', password: '', name: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email: authData.email, password: authData.password });
      setShowLogin(false);
      setAuthData({ email: '', password: '', name: '' });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register({ email: authData.email, password: authData.password, name: authData.name });
      setShowRegister(false);
      setAuthData({ email: '', password: '', name: '' });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <StyledButton variant="secondary" size="sm" disabled>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      </StyledButton>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-2">
        <StyledButton variant="secondary" size="sm">
          <span className="user-avatar">👤</span>
          <span className="user-name">{user.name || user.email}</span>
        </StyledButton>
        <StyledButton variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </StyledButton>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <StyledButton 
        variant="secondary" 
        size="sm"
        onClick={() => setShowLogin(true)}
      >
        Login
      </StyledButton>
      <StyledButton 
        variant="outline" 
        size="sm"
        onClick={() => setShowRegister(true)}
      >
        Register
      </StyledButton>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Login</h3>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={authData.email}
                onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={authData.password}
                onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                className="w-full p-2 border rounded mb-4"
                required
              />
              <div className="flex space-x-2">
                <StyledButton type="submit" variant="default">
                  Login
                </StyledButton>
                <StyledButton 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowLogin(false)}
                >
                  Cancel
                </StyledButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Register</h3>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Name"
                value={authData.name}
                onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={authData.email}
                onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="password"
                placeholder="Password (min 8 characters)"
                value={authData.password}
                onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                className="w-full p-2 border rounded mb-4"
                required
                minLength={8}
              />
              <div className="flex space-x-2">
                <StyledButton type="submit" variant="default">
                  Register
                </StyledButton>
                <StyledButton 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowRegister(false)}
                >
                  Cancel
                </StyledButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Navigation component with performance optimizations
const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

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
            <AuthComponent />
          </div>
        </div>
      </CompositeCard>
    </header>
  );
};

// Move all logic that uses useNavigate into AppContent
const AppContent = () => {
  const { user, isAuthenticated, isLoading: authLoading, error: authError, initialize: initAuth } = useAuthStore();
  const { isLoading: dataLoading, error: dataError, initialize: initData } = useDataStore();
  const navigate = useNavigate();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  // Initialize auth and data on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize authentication first
        await initAuth();
        
        // If user is authenticated, initialize data
        if (isAuthenticated && user) {
          await initData(user.id);
        }
      } catch (error) {
        console.error('App initialization failed:', error);
      }
    };
    
    initializeApp();
  }, [initAuth, initData, isAuthenticated, user]);

  // Initialize data when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      initData(user.id);
    }
  }, [isAuthenticated, user, initData]);

  // Show loading state
  if (authLoading || dataLoading) {
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
  if (authError || dataError) {
    return (
      <div className="app-error">
        <div className="error-container">
          <h2>Initialization Error</h2>
          <p>{authError || dataError}</p>
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
