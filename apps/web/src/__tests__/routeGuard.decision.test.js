/**
 * Route Guard decision unit tests
 */
import { describe, it, expect } from 'vitest';
import { evaluateRouteDecision } from '../utils/RouteGuard.jsx';

describe('evaluateRouteDecision', () => {
  it('unauth user blocked from dashboard', () => {
    const dest = evaluateRouteDecision({ isAuthenticated: false, isDemo: false, onboardingDone: false, path: '/dashboard' });
    expect(dest).toBe('/');
  });

  it('demo user not done redirected to onboarding from dashboard', () => {
    const dest = evaluateRouteDecision({ isAuthenticated: false, isDemo: true, onboardingDone: false, path: '/dashboard' });
    expect(dest).toBe('/onboarding');
  });

  it('demo user done redirected away from onboarding', () => {
    const dest = evaluateRouteDecision({ isAuthenticated: false, isDemo: true, onboardingDone: true, path: '/onboarding' });
    expect(dest).toBe('/dashboard');
  });

  it('auth user not done must stay on onboarding', () => {
    const dest = evaluateRouteDecision({ isAuthenticated: true, isDemo: false, onboardingDone: false, path: '/dashboard' });
    expect(dest).toBe('/onboarding');
  });
});


