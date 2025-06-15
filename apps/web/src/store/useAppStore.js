import { create } from 'zustand';

// This is a simple global state store using Zustand
// It holds a counter and provides actions to change it
const useAppStore = create((set) => ({
  counter: 0, // The counter value
  increment: () => set((state) => ({ counter: state.counter + 1 })), // Add 1 to counter
  reset: () => set({ counter: 0 }), // Reset counter to 0
}));

export default useAppStore; 