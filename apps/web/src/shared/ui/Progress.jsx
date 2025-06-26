/**
 * Progress.jsx - AlphaFrame VX.1 Finalization
 * 
 * Purpose: Progress indicator component for multi-step flows
 * like onboarding and setup processes.
 * 
 * Procedure:
 * 1. Display current step and total steps
 * 2. Show visual progress bar
 * 3. Handle step completion states
 * 4. Provide accessibility features
 * 
 * Conclusion: Provides clear visual feedback for
 * multi-step user flows and progress tracking.
 */

import React from 'react';

/**
 * Progress indicator component
 * @param {Object} props - Component props
 * @param {number} props.currentStep - Current step number
 * @param {number} props.totalSteps - Total number of steps
 * @param {string[]} props.steps - Optional array of step labels
 * @param {string} props.className - Optional CSS class name
 */
export const Progress = ({ 
  currentStep, 
  totalSteps, 
  steps = [], 
  className = '' 
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
        />
      </div>

      {/* Step Information */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Step {currentStep} of {totalSteps}
        </span>
        <span>
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>

      {/* Step Labels */}
      {steps.length > 0 && (
        <div className="mt-2">
          <span className="text-sm font-medium text-gray-900">
            {steps[currentStep - 1] || `Step ${currentStep}`}
          </span>
        </div>
      )}
    </div>
  );
};

export default Progress; 