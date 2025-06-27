/**
 * User Testing Scenarios for AlphaFrame Helios Initiative
 * 
 * PURPOSE:
 * This file defines comprehensive testing scenarios that cover all key user journeys,
 * edge cases, and critical paths in the AlphaFrame application. These scenarios
 * ensure we validate our "Calm Confidence" brand goals across all user interactions.
 * 
 * PROCEDURE:
 * 1. Define core user journeys and tasks
 * 2. Create edge case scenarios
 * 3. Establish accessibility testing scenarios
 * 4. Set up performance and emotional response testing
 * 
 * CONCLUSION:
 * These scenarios provide a complete framework for validating user experience
 * and ensuring our application meets user needs and expectations.
 */

import { VALIDATION_TYPES } from './UserValidationProtocol';

// ============================================================================
// CORE USER JOURNEYS
// ============================================================================

/**
 * Primary user journey scenarios
 * These represent the most common and critical user paths
 */
export const CORE_USER_JOURNEYS = {
  FIRST_TIME_ONBOARDING: {
    id: 'first_time_onboarding',
    title: 'First-Time User Onboarding',
    description: 'Complete onboarding flow for a new user',
    type: VALIDATION_TYPES.USABILITY_TESTING,
    tasks: [
      {
        id: 'onboarding_welcome',
        title: 'Welcome Screen',
        description: 'User lands on welcome screen and understands the value proposition',
        success_criteria: [
          'User can read and understand the welcome message',
          'User feels confident about proceeding',
          'User clicks "Get Started" within 30 seconds'
        ],
        expected_duration: 30, // seconds
        difficulty: 'easy'
      },
      {
        id: 'onboarding_profile_setup',
        title: 'Profile Setup',
        description: 'User completes basic profile information',
        success_criteria: [
          'User fills out all required fields',
          'User understands what information is being collected',
          'User feels comfortable sharing the information',
          'Form validation works correctly'
        ],
        expected_duration: 120, // seconds
        difficulty: 'medium'
      },
      {
        id: 'onboarding_preferences',
        title: 'Preferences Configuration',
        description: 'User sets up their financial preferences and goals',
        success_criteria: [
          'User can select their financial goals',
          'User understands the risk tolerance options',
          'User feels the options are relevant to them',
          'User can modify selections easily'
        ],
        expected_duration: 90, // seconds
        difficulty: 'medium'
      },
      {
        id: 'onboarding_completion',
        title: 'Onboarding Completion',
        description: 'User completes onboarding and reaches the dashboard',
        success_criteria: [
          'User sees a clear completion message',
          'User understands what happens next',
          'User feels excited and confident about using the app',
          'User can access the main dashboard'
        ],
        expected_duration: 45, // seconds
        difficulty: 'easy'
      }
    ],
    success_metrics: {
      completion_rate: 0.90, // 90% should complete full onboarding
      satisfaction_score: 4.5, // out of 5
      confidence_score: 4.5, // out of 5
      time_to_complete: 285 // 4 minutes 45 seconds total
    }
  },

  DASHBOARD_EXPLORATION: {
    id: 'dashboard_exploration',
    title: 'Dashboard Exploration and Navigation',
    description: 'User explores and navigates the main dashboard',
    type: VALIDATION_TYPES.USABILITY_TESTING,
    tasks: [
      {
        id: 'dashboard_overview',
        title: 'Dashboard Overview',
        description: 'User understands the dashboard layout and key information',
        success_criteria: [
          'User can identify key financial metrics',
          'User understands what each widget shows',
          'User feels the information is relevant and useful',
          'User can see their financial status at a glance'
        ],
        expected_duration: 60, // seconds
        difficulty: 'easy'
      },
      {
        id: 'dashboard_navigation',
        title: 'Dashboard Navigation',
        description: 'User navigates between different dashboard sections',
        success_criteria: [
          'User can switch between dashboard modes',
          'User understands the difference between modes',
          'Navigation feels intuitive and smooth',
          'User can return to previous views easily'
        ],
        expected_duration: 45, // seconds
        difficulty: 'easy'
      },
      {
        id: 'widget_interaction',
        title: 'Widget Interaction',
        description: 'User interacts with dashboard widgets',
        success_criteria: [
          'User can click on widgets to see more details',
          'User understands what additional information is available',
          'Widget interactions feel responsive',
          'User can close detailed views easily'
        ],
        expected_duration: 90, // seconds
        difficulty: 'medium'
      }
    ],
    success_metrics: {
      exploration_completion: 0.95, // 95% should explore all sections
      navigation_success: 0.95, // 95% should navigate successfully
      widget_interaction: 0.80, // 80% should interact with widgets
      time_to_explore: 195 // 3 minutes 15 seconds total
    }
  },

  RULES_CREATION: {
    id: 'rules_creation',
    title: 'Financial Rules Creation',
    description: 'User creates and configures financial automation rules',
    type: VALIDATION_TYPES.USABILITY_TESTING,
    tasks: [
      {
        id: 'rules_overview',
        title: 'Rules Overview',
        description: 'User understands the rules page and available options',
        success_criteria: [
          'User can see existing rules (if any)',
          'User understands what rules can do',
          'User feels confident about creating rules',
          'User can identify the "Create Rule" button'
        ],
        expected_duration: 45, // seconds
        difficulty: 'easy'
      },
      {
        id: 'rule_creation_form',
        title: 'Rule Creation Form',
        description: 'User fills out the rule creation form',
        success_criteria: [
          'User can select rule type and conditions',
          'User understands the form fields and options',
          'User can set up trigger conditions',
          'User can configure action parameters',
          'Form validation provides helpful feedback'
        ],
        expected_duration: 180, // seconds
        difficulty: 'hard'
      },
      {
        id: 'rule_preview',
        title: 'Rule Preview and Confirmation',
        description: 'User reviews and confirms the rule',
        success_criteria: [
          'User can understand the rule summary',
          'User feels confident about the rule configuration',
          'User can modify the rule if needed',
          'User can activate the rule successfully'
        ],
        expected_duration: 60, // seconds
        difficulty: 'medium'
      }
    ],
    success_metrics: {
      rule_creation_success: 0.85, // 85% should successfully create rules
      form_completion: 0.90, // 90% should complete the form
      confidence_score: 4.0, // out of 5
      time_to_create: 285 // 4 minutes 45 seconds total
    }
  },

  SETTINGS_MANAGEMENT: {
    id: 'settings_management',
    title: 'Settings and Profile Management',
    description: 'User manages their account settings and profile',
    type: VALIDATION_TYPES.USABILITY_TESTING,
    tasks: [
      {
        id: 'settings_navigation',
        title: 'Settings Navigation',
        description: 'User navigates to and explores settings',
        success_criteria: [
          'User can find the settings page',
          'User understands the settings categories',
          'User can navigate between setting sections',
          'Settings feel organized and logical'
        ],
        expected_duration: 60, // seconds
        difficulty: 'easy'
      },
      {
        id: 'profile_editing',
        title: 'Profile Editing',
        description: 'User updates their profile information',
        success_criteria: [
          'User can edit profile fields',
          'User can save changes successfully',
          'User receives confirmation of changes',
          'User feels their data is secure'
        ],
        expected_duration: 120, // seconds
        difficulty: 'medium'
      },
      {
        id: 'preferences_management',
        title: 'Preferences Management',
        description: 'User updates their preferences and settings',
        success_criteria: [
          'User can modify notification settings',
          'User can update privacy preferences',
          'User can change display options',
          'Changes are applied immediately'
        ],
        expected_duration: 90, // seconds
        difficulty: 'medium'
      }
    ],
    success_metrics: {
      settings_exploration: 0.90, // 90% should explore settings
      profile_update_success: 0.95, // 95% should successfully update profile
      preferences_update: 0.90, // 90% should update preferences
      time_to_manage: 270 // 4 minutes 30 seconds total
    }
  }
};

// ============================================================================
// EDGE CASE SCENARIOS
// ============================================================================

/**
 * Edge case and error handling scenarios
 * These test how the application handles unusual situations
 */
export const EDGE_CASE_SCENARIOS = {
  SLOW_CONNECTION: {
    id: 'slow_connection',
    title: 'Slow Internet Connection',
    description: 'Test application behavior with slow network',
    type: VALIDATION_TYPES.PERFORMANCE_VALIDATION,
    setup: 'Simulate 2G or slow 3G connection',
    tasks: [
      {
        id: 'slow_page_load',
        title: 'Page Loading',
        description: 'Pages load gracefully with loading indicators',
        success_criteria: [
          'Loading indicators are visible and informative',
          'User understands the app is working',
          'No blank screens or frozen states',
          'User feels the app is responsive despite slowness'
        ]
      },
      {
        id: 'slow_interactions',
        title: 'User Interactions',
        description: 'User interactions remain responsive',
        success_criteria: [
          'Buttons show loading states',
          'User can see their actions are being processed',
          'No double-clicks or repeated actions',
          'User feels in control of the process'
        ]
      }
    ]
  },

  ERROR_STATES: {
    id: 'error_states',
    title: 'Error Handling and Recovery',
    description: 'Test how the app handles various error conditions',
    type: VALIDATION_TYPES.USABILITY_TESTING,
    tasks: [
      {
        id: 'network_errors',
        title: 'Network Errors',
        description: 'App handles network failures gracefully',
        success_criteria: [
          'Clear error messages are displayed',
          'User understands what went wrong',
          'Retry options are available',
          'User feels supported, not frustrated'
        ]
      },
      {
        id: 'validation_errors',
        title: 'Form Validation Errors',
        description: 'Form errors are clear and helpful',
        success_criteria: [
          'Error messages are specific and actionable',
          'User knows exactly what to fix',
          'Errors are highlighted clearly',
          'User can correct errors easily'
        ]
      },
      {
        id: 'permission_errors',
        title: 'Permission and Access Errors',
        description: 'App handles permission issues appropriately',
        success_criteria: [
          'User understands what permissions are needed',
          'Clear instructions for granting permissions',
          'Graceful fallback when permissions denied',
          'User feels their privacy is respected'
        ]
      }
    ]
  },

  ACCESSIBILITY_EDGE_CASES: {
    id: 'accessibility_edge_cases',
    title: 'Accessibility Edge Cases',
    description: 'Test accessibility in challenging scenarios',
    type: VALIDATION_TYPES.ACCESSIBILITY_AUDIT,
    tasks: [
      {
        id: 'screen_reader_complexity',
        title: 'Complex Screen Reader Navigation',
        description: 'Screen reader handles complex layouts',
        success_criteria: [
          'All content is accessible via screen reader',
          'Navigation order is logical',
          'ARIA labels are descriptive and helpful',
          'User can complete all tasks with screen reader'
        ]
      },
      {
        id: 'keyboard_only_navigation',
        title: 'Keyboard-Only Navigation',
        description: 'All functionality accessible via keyboard',
        success_criteria: [
          'All interactive elements are keyboard accessible',
          'Focus indicators are visible and clear',
          'Tab order is logical and intuitive',
          'No keyboard traps or inaccessible areas'
        ]
      },
      {
        id: 'high_contrast_mode',
        title: 'High Contrast Mode',
        description: 'App works well in high contrast mode',
        success_criteria: [
          'All text is readable in high contrast',
          'Interactive elements are clearly visible',
          'No information is lost in high contrast',
          'User can complete all tasks in high contrast'
        ]
      }
    ]
  }
};

// ============================================================================
// EMOTIONAL RESPONSE SCENARIOS
// ============================================================================

/**
 * Emotional response and user sentiment scenarios
 * These test how the app makes users feel
 */
export const EMOTIONAL_RESPONSE_SCENARIOS = {
  FIRST_IMPRESSION: {
    id: 'first_impression',
    title: 'First Impression and Trust Building',
    description: 'Test initial emotional response and trust',
    type: VALIDATION_TYPES.EMOTIONAL_RESPONSE,
    tasks: [
      {
        id: 'landing_page_emotion',
        title: 'Landing Page Emotional Response',
        description: 'User\'s emotional response to landing page',
        success_criteria: [
          'User feels confident about the app',
          'User trusts the brand and company',
          'User feels excited to try the app',
          'User doesn\'t feel overwhelmed or confused'
        ],
        measurement: '5-point scale for confidence, trust, excitement, clarity'
      },
      {
        id: 'onboarding_emotion',
        title: 'Onboarding Emotional Journey',
        description: 'User\'s emotional state throughout onboarding',
        success_criteria: [
          'User feels supported and guided',
          'User feels their time is valued',
          'User feels confident about their choices',
          'User feels excited about the possibilities'
        ],
        measurement: 'Continuous emotional tracking throughout process'
      }
    ]
  },

  STRESS_TESTING: {
    id: 'stress_testing',
    title: 'Stress and Anxiety Management',
    description: 'Test how the app handles user stress and anxiety',
    type: VALIDATION_TYPES.EMOTIONAL_RESPONSE,
    tasks: [
      {
        id: 'financial_stress',
        title: 'Financial Stress Scenarios',
        description: 'App response to user financial stress',
        success_criteria: [
          'App provides calming, supportive messaging',
          'User feels less anxious about finances',
          'App offers helpful guidance and resources',
          'User feels empowered, not overwhelmed'
        ]
      },
      {
        id: 'technical_stress',
        title: 'Technical Difficulty Stress',
        description: 'App response to technical difficulties',
        success_criteria: [
          'Error messages are reassuring, not alarming',
          'User feels supported in solving problems',
          'Help options are easily accessible',
          'User doesn\'t feel stupid or frustrated'
        ]
      }
    ]
  },

  CONFIDENCE_BUILDING: {
    id: 'confidence_building',
    title: 'Confidence and Empowerment',
    description: 'Test how the app builds user confidence',
    type: VALIDATION_TYPES.EMOTIONAL_RESPONSE,
    tasks: [
      {
        id: 'success_celebration',
        title: 'Success Celebration',
        description: 'App celebrates user successes appropriately',
        success_criteria: [
          'User feels proud of their accomplishments',
          'Success messages are encouraging but not patronizing',
          'User feels motivated to continue',
          'User feels their efforts are recognized'
        ]
      },
      {
        id: 'progress_visibility',
        title: 'Progress Visibility',
        description: 'User can see and understand their progress',
        success_criteria: [
          'User understands their current status',
          'User can see their progress toward goals',
          'User feels confident about their trajectory',
          'User feels in control of their financial journey'
        ]
      }
    ]
  }
};

// ============================================================================
// PERFORMANCE SCENARIOS
// ============================================================================

/**
 * Performance and technical validation scenarios
 * These test the technical performance of the application
 */
export const PERFORMANCE_SCENARIOS = {
  LOAD_TIME_VALIDATION: {
    id: 'load_time_validation',
    title: 'Page Load Time Validation',
    description: 'Test page load times across different scenarios',
    type: VALIDATION_TYPES.PERFORMANCE_VALIDATION,
    tasks: [
      {
        id: 'initial_load',
        title: 'Initial Application Load',
        description: 'First load of the application',
        success_criteria: [
          'App loads within 2 seconds on 3G',
          'App loads within 1 second on 4G/WiFi',
          'Loading indicators are shown appropriately',
          'User doesn\'t experience blank screens'
        ],
        performance_targets: {
          '3G': 2000, // milliseconds
          '4G': 1000, // milliseconds
          'WiFi': 1000 // milliseconds
        }
      },
      {
        id: 'navigation_load',
        title: 'Navigation Load Times',
        description: 'Load times for navigation between pages',
        success_criteria: [
          'Page transitions feel instant',
          'No loading delays on navigation',
          'Content appears progressively',
          'User doesn\'t wait for full page loads'
        ],
        performance_targets: {
          'navigation': 300, // milliseconds
          'content_ready': 500 // milliseconds
        }
      }
    ]
  },

  INTERACTION_RESPONSIVENESS: {
    id: 'interaction_responsiveness',
    title: 'Interaction Responsiveness',
    description: 'Test responsiveness of user interactions',
    type: VALIDATION_TYPES.PERFORMANCE_VALIDATION,
    tasks: [
      {
        id: 'button_responses',
        title: 'Button and Form Responses',
        description: 'Response time for buttons and form interactions',
        success_criteria: [
          'Buttons respond within 100ms',
          'Form submissions show immediate feedback',
          'No double-clicks or repeated actions',
          'User feels the app is responsive'
        ],
        performance_targets: {
          'button_response': 100, // milliseconds
          'form_feedback': 200 // milliseconds
        }
      },
      {
        id: 'animation_smoothness',
        title: 'Animation and Transition Smoothness',
        description: 'Smoothness of animations and transitions',
        success_criteria: [
          'Animations run at 60fps',
          'Transitions feel natural and smooth',
          'No stuttering or lag',
          'Animations enhance, not distract from experience'
        ],
        performance_targets: {
          'animation_fps': 60,
          'transition_duration': 300 // milliseconds
        }
      }
    ]
  }
};

// ============================================================================
// SCENARIO UTILITIES
// ============================================================================

/**
 * Get all scenarios for a specific validation type
 * @param {string} validationType - The type of validation
 */
export function getScenariosByType(validationType) {
  const allScenarios = {
    ...CORE_USER_JOURNEYS,
    ...EDGE_CASE_SCENARIOS,
    ...EMOTIONAL_RESPONSE_SCENARIOS,
    ...PERFORMANCE_SCENARIOS
  };

  return Object.values(allScenarios).filter(
    scenario => scenario.type === validationType
  );
}

/**
 * Get scenario by ID
 * @param {string} scenarioId - The scenario ID
 */
export function getScenarioById(scenarioId) {
  const allScenarios = {
    ...CORE_USER_JOURNEYS,
    ...EDGE_CASE_SCENARIOS,
    ...EMOTIONAL_RESPONSE_SCENARIOS,
    ...PERFORMANCE_SCENARIOS
  };

  return allScenarios[scenarioId] || null;
}

/**
 * Calculate total estimated time for a scenario
 * @param {object} scenario - The scenario object
 */
export function calculateScenarioTime(scenario) {
  if (!scenario.tasks) return 0;
  
  return scenario.tasks.reduce((total, task) => {
    return total + (task.expected_duration || 0);
  }, 0);
}

/**
 * Get difficulty level for a scenario
 * @param {object} scenario - The scenario object
 */
export function getScenarioDifficulty(scenario) {
  if (!scenario.tasks) return 'unknown';
  
  const difficulties = scenario.tasks.map(task => task.difficulty);
  const difficultyCounts = difficulties.reduce((counts, difficulty) => {
    counts[difficulty] = (counts[difficulty] || 0) + 1;
    return counts;
  }, {});
  
  // Return the most common difficulty, or 'medium' as default
  const maxCount = Math.max(...Object.values(difficultyCounts));
  const mostCommon = Object.keys(difficultyCounts).find(
    key => difficultyCounts[key] === maxCount
  );
  
  return mostCommon || 'medium';
}

export default {
  CORE_USER_JOURNEYS,
  EDGE_CASE_SCENARIOS,
  EMOTIONAL_RESPONSE_SCENARIOS,
  PERFORMANCE_SCENARIOS,
  getScenariosByType,
  getScenarioById,
  calculateScenarioTime,
  getScenarioDifficulty
}; 