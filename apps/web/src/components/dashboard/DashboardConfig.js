/**
 * DashboardConfig - Declarative dashboard configuration
 * 
 * Purpose: Provides a centralized configuration system for dashboard
 * layout, sections, and behavior based on user context and preferences.
 * 
 * Procedure:
 * 1. Defines section priorities and visibility rules
 * 2. Configures layout based on screen size and user preferences
 * 3. Manages section dependencies and data requirements
 * 4. Provides theme and interaction configurations
 * 
 * Conclusion: Enables flexible, context-aware dashboard layouts
 * that adapt to user needs and system capabilities.
 */

export const DashboardConfig = {
  // Default configuration
  default: {
    layout: 'grid',
    theme: 'light',
    sections: {
      whatsNext: {
        priority: 1,
        visible: true,
        required: true,
        gridSpan: 2,
        animationDelay: 0
      },
      cashflow: {
        priority: 2,
        visible: true,
        required: true,
        gridSpan: 2,
        animationDelay: 100
      },
      insights: {
        priority: 3,
        visible: true,
        required: false,
        gridSpan: 1,
        animationDelay: 200
      },
      networth: {
        priority: 4,
        visible: true,
        required: false,
        gridSpan: 2,
        animationDelay: 300
      },
      changes: {
        priority: 5,
        visible: true,
        required: false,
        gridSpan: 1,
        animationDelay: 400
      },
      actions: {
        priority: 6,
        visible: true,
        required: false,
        gridSpan: 2,
        animationDelay: 500
      }
    },
    breakpoints: {
      mobile: 768,
      tablet: 1024,
      desktop: 1200
    },
    animations: {
      enabled: true,
      duration: 300,
      easing: 'ease-out'
    }
  },

  // Configuration for different user types
  userTypes: {
    newUser: {
      sections: {
        whatsNext: { priority: 1, visible: true, required: true },
        cashflow: { priority: 2, visible: true, required: true },
        insights: { priority: 3, visible: false, required: false },
        networth: { priority: 4, visible: false, required: false },
        changes: { priority: 5, visible: true, required: false },
        actions: { priority: 6, visible: true, required: false }
      }
    },
    powerUser: {
      sections: {
        whatsNext: { priority: 1, visible: true, required: true },
        cashflow: { priority: 2, visible: true, required: true },
        insights: { priority: 3, visible: true, required: true },
        networth: { priority: 4, visible: true, required: true },
        changes: { priority: 5, visible: true, required: true },
        actions: { priority: 6, visible: true, required: true }
      }
    },
    mobileUser: {
      layout: 'stack',
      sections: {
        whatsNext: { priority: 1, visible: true, required: true, gridSpan: 1 },
        cashflow: { priority: 2, visible: true, required: true, gridSpan: 1 },
        insights: { priority: 3, visible: false, required: false, gridSpan: 1 },
        networth: { priority: 4, visible: true, required: false, gridSpan: 1 },
        changes: { priority: 5, visible: true, required: false, gridSpan: 1 },
        actions: { priority: 6, visible: true, required: false, gridSpan: 1 }
      }
    }
  },

  // Configuration for different financial states
  financialStates: {
    healthy: {
      sections: {
        insights: { priority: 3, visible: true },
        networth: { priority: 4, visible: true }
      }
    },
    needsAttention: {
      sections: {
        whatsNext: { priority: 1, visible: true },
        cashflow: { priority: 2, visible: true },
        actions: { priority: 3, visible: true }
      }
    },
    debtFocused: {
      sections: {
        cashflow: { priority: 1, visible: true },
        actions: { priority: 2, visible: true },
        insights: { priority: 3, visible: true }
      }
    }
  }
};

/**
 * Get dashboard configuration based on user context
 */
export const getDashboardConfig = (userContext, financialState) => {
  let config = { ...DashboardConfig.default };

  // Apply user type configuration
  if (userContext?.userType) {
    const userTypeConfig = DashboardConfig.userTypes[userContext.userType];
    if (userTypeConfig) {
      config = { ...config, ...userTypeConfig };
    }
  }

  // Apply financial state configuration
  if (financialState?.health) {
    const financialConfig = DashboardConfig.financialStates[financialState.health];
    if (financialConfig) {
      config.sections = { ...config.sections, ...financialConfig.sections };
    }
  }

  // Apply mobile configuration
  if (userContext?.isMobile) {
    const mobileConfig = DashboardConfig.userTypes.mobileUser;
    config = { ...config, ...mobileConfig };
  }

  return config;
};

/**
 * Get visible sections in priority order
 */
export const getVisibleSections = (config) => {
  return Object.entries(config.sections)
    .filter(([, section]) => section.visible)
    .sort(([, a], [, b]) => a.priority - b.priority)
    .map(([key, section]) => ({ key, ...section }));
};

/**
 * Get section configuration by key
 */
export const getSectionConfig = (config, sectionKey) => {
  return config.sections[sectionKey] || null;
};

/**
 * Check if section is required
 */
export const isSectionRequired = (config, sectionKey) => {
  const section = config.sections[sectionKey];
  return section?.required || false;
};

/**
 * Get animation delay for section
 */
export const getSectionAnimationDelay = (config, sectionKey) => {
  const section = config.sections[sectionKey];
  return section?.animationDelay || 0;
};

export default DashboardConfig; 