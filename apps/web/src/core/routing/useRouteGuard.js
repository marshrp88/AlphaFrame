/**
 * Route Guard Hook
 */
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/core/store/authStore';
import useAppStore from '@/store/useAppStore';
import { useOnboardingFsmStore } from '@/core/store/onboardingStore';

const PUBLIC_ROUTES = new Set(['/', '/home', '/about', '/onboarding']);

export function evaluateRoute({ isAuthenticated, isDemo, onboardingDone, path }) {
  if (!isAuthenticated && !isDemo) {
    if (path === '/dashboard') return '/';
    return PUBLIC_ROUTES.has(path) ? path : '/';
  }
  if (isDemo) {
    if (!onboardingDone) return path === '/dashboard' ? '/onboarding' : path;
    if (path === '/onboarding') return '/dashboard';
    return path;
  }
  if (isAuthenticated) {
    if (!onboardingDone) return path === '/dashboard' ? '/onboarding' : path;
    if (path === '/onboarding') return '/dashboard';
    return path;
  }
  return path;
}

export function useRouteGuard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { isDemo, onboardingComplete } = useAppStore();
  const { isCompleted } = useOnboardingFsmStore();

  useEffect(() => {
    const onboardingDone = Boolean(onboardingComplete || isCompleted);
    const target = evaluateRoute({ isAuthenticated, isDemo, onboardingDone, path: location.pathname });
    if (target !== location.pathname) navigate(target, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isDemo, onboardingComplete, isCompleted, location.pathname]);
}

export default useRouteGuard;

