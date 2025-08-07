/**
 * Route Guard (logic + tiny hook)
 *
 * Purpose (10th grade): Decide which pages a user is allowed to visit based on
 * whether they are signed in, using demo mode, and finished with onboarding.
 *
 * Procedure: Use `evaluateRoute` to check the current path. If not allowed,
 * redirect to the correct page.
 *
 * Conclusion: One place defines navigation rules so routes are predictable.
 */

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/core/store/authStore';
import useAppStore from '@/store/useAppStore';
import { useOnboardingFsmStore } from '@/core/store/onboardingStore';

const PUBLIC_ROUTES = new Set(['/', '/home', '/about', '/onboarding']);

export function evaluateRoute({ isAuthenticated, isDemo, onboardingDone, path }) {
  // Unauthenticated, not demo
  if (!isAuthenticated && !isDemo) {
    if (path === '/dashboard') return '/';
    // allow public routes, otherwise send home
    return PUBLIC_ROUTES.has(path) ? path : '/';
  }

  // Demo users
  if (isDemo) {
    if (!onboardingDone) {
      return path === '/dashboard' ? '/onboarding' : path;
    }
    // onboarding complete
    if (path === '/onboarding') return '/dashboard';
    return path;
  }

  // Authenticated users
  if (isAuthenticated) {
    if (!onboardingDone) {
      return path === '/dashboard' ? '/onboarding' : path;
    }
    // onboarding complete
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
    const target = evaluateRoute({
      isAuthenticated,
      isDemo,
      onboardingDone,
      path: location.pathname,
    });
    if (target !== location.pathname) {
      navigate(target, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isDemo, onboardingComplete, isCompleted, location.pathname]);
}

export default useRouteGuard;


