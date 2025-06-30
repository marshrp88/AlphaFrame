/**
 * Toast Hook - Provides toast notification functionality
 * 
 * Purpose: Enables displaying temporary notification messages to users
 * Procedure: Returns a toast function that can be used to show notifications
 * Conclusion: Provides consistent user feedback across the application
 */
export const useToast = () => {
  const toast = ({ title, description, variant = 'default', duration = 5000 }) => {
    // Simple console fallback for now
    console.log(`TOAST [${variant.toUpperCase()}]: ${title}${description ? ` - ${description}` : ''}`);
    
    // In a real implementation, this would dispatch to a toast manager
    // For now, we'll just log to console to avoid breaking the app
  };

  return {
    toast,
    dismiss: (toastId) => {
      console.log(`Dismissing toast: ${toastId}`);
    },
    dismissAll: () => {
      console.log('Dismissing all toasts');
    }
  };
}; 