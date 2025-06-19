// utils.js
// Utility function for merging class names (shadcn/ui pattern)
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
} 
