// use-toast.jsx
// A simple custom hook for showing toasts (notifications).
// Exports a single named useToast hook.
import { useCallback } from 'react';

export function useToast() {
  // This is a stub. Replace with your actual toast logic if needed.
  const toast = useCallback(({ title, description }) => {
    window.alert(`${title}\n${typeof description === 'string' ? description : ''}`);
  }, []);
  return { toast };
}
// Use this for showing notifications in the app. 
