// AppRouter.jsx - Phoenix Initiative V3.1
// Purpose: Main router for AlphaFrame app, Phase 1 scaffold
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './DashboardPage.jsx';
import RulesPage from './RulesPage.jsx';
import Profile from './Profile.jsx';
import SettingsPage from './SettingsPage.jsx';
import OnboardingPage from './OnboardingPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';

const AppRouter = () => (
  <Router>
    {/* Simple nav stub for demo purposes */}
    <nav style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
      <a href="/dashboard" style={{ marginRight: 16 }}>Dashboard</a>
      <a href="/rules" style={{ marginRight: 16 }}>Rules</a>
      <a href="/profile" style={{ marginRight: 16 }}>Profile</a>
      <a href="/settings" style={{ marginRight: 16 }}>Settings</a>
      <a href="/onboarding">Onboarding</a>
    </nav>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/rules" element={<RulesPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default AppRouter; 