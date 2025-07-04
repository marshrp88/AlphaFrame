import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export default function RouteGuard({ requiresOnboarding, children }) {
  const { onboardingComplete } = useAppStore();

  if (requiresOnboarding && !onboardingComplete) {
    return <Navigate to="/" />;
  }

  return children;
} 