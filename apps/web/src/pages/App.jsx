import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OnboardingFlow from './OnboardingFlow';
import DashboardPage from './DashboardPage';
import { useAppStore } from '../store/useAppStore';
import RouteGuard from '../utils/RouteGuard';
import ErrorBoundary from '../components/ErrorBoundary';
import NotFound from '../components/NotFound';

export default function App() {
  const { onboardingComplete } = useAppStore();

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<OnboardingFlow />} />
          <Route
            path="/dashboard"
            element={
              <RouteGuard requiresOnboarding>
                <DashboardPage />
              </RouteGuard>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
} 