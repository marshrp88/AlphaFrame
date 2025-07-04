import { create } from 'zustand';

export const useAppStore = create((set) => ({
  isDemo: !!sessionStorage.getItem('demo_user'),
  onboardingComplete: localStorage.getItem('alphaframe_onboarding_complete') === 'true',
  lastUpdated: new Date().toLocaleString(),
  setDemo: () => set(() => ({ isDemo: true })),
  completeOnboarding: () => {
    localStorage.setItem('alphaframe_onboarding_complete', 'true');
    set({ onboardingComplete: true });
  },
  resetDemo: () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/';
  },
})); 