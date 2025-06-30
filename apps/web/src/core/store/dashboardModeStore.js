import { create } from 'zustand';

/**
 * Dashboard Mode Store - Manages dashboard view modes and preferences
 * 
 * Purpose: Controls which dashboard view is active and user preferences
 * Procedure: Uses Zustand to manage dashboard state and mode switching
 * Conclusion: Enables consistent dashboard behavior and user experience
 */
export const useDashboardModeStore = create((set, get) => ({
  // Dashboard mode state
  currentMode: 'overview', // overview, detailed, pro
  viewPreferences: {
    showCharts: true,
    showInsights: true,
    compactView: false,
  },
  
  // Actions
  setMode: (mode) => set({ currentMode: mode }),
  toggleViewPreference: (key) => set((state) => ({
    viewPreferences: {
      ...state.viewPreferences,
      [key]: !state.viewPreferences[key]
    }
  })),
  
  // Computed values
  isProMode: () => get().currentMode === 'pro',
  isDetailedView: () => get().currentMode === 'detailed',
})); 