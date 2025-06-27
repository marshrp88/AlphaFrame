/**
 * DarkModeToggle.jsx - AlphaFrame VX.1 Dark Mode Toggle
 * 
 * Purpose: Provides users with a smooth, accessible dark mode toggle
 * that respects user preferences and provides visual feedback.
 * 
 * Procedure:
 * 1. Detect system preference for dark mode
 * 2. Provide manual toggle with smooth transitions
 * 3. Store preference in localStorage
 * 4. Apply CSS custom properties for theme switching
 * 5. Ensure accessibility with proper ARIA labels
 * 
 * Conclusion: Creates a professional dark mode experience
 * that enhances user comfort and reduces eye strain.
 */

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import StyledButton from './StyledButton';
import './DarkModeToggle.css';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize dark mode state
  useEffect(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('alphaframe-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    setIsDark(shouldBeDark);
    setIsLoaded(true);
    
    // Apply theme immediately
    applyTheme(shouldBeDark);
  }, []);

  // Apply theme to document
  const applyTheme = (dark) => {
    const root = document.documentElement;
    
    if (dark) {
      root.classList.add('dark-mode');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark-mode');
      root.setAttribute('data-theme', 'light');
    }
  };

  // Handle theme toggle
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    applyTheme(newTheme);
    
    // Save preference
    localStorage.setItem('alphaframe-theme', newTheme ? 'dark' : 'light');
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only auto-switch if user hasn't set a preference
      if (!localStorage.getItem('alphaframe-theme')) {
        const newTheme = e.matches;
        setIsDark(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Don't render until loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return (
    <StyledButton
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="dark-mode-toggle"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="theme-icon" size={16} />
      ) : (
        <Moon className="theme-icon" size={16} />
      )}
      <span className="sr-only">
        {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
    </StyledButton>
  );
};

export default DarkModeToggle; 