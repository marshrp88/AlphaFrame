/**
 * RuleTemplateService.js - Pre-built Rule Templates
 * 
 * Purpose: Provide pre-built rule templates for common financial scenarios
 * to help users quickly set up useful automation without starting from scratch.
 * 
 * Procedure:
 * 1. Define common financial automation scenarios
 * 2. Create template rules with sensible defaults
 * 3. Provide customization options for each template
 * 4. Track template usage for analytics
 * 5. Suggest templates based on user behavior
 * 
 * Conclusion: Accelerates user onboarding and rule creation by providing
 * proven automation patterns that users can customize to their needs.
 */

class RuleTemplateService {
  constructor() {
    this.templates = this.initializeTemplates();
    this.usageStats = this.loadUsageStats();
  }

  /**
   * Initialize rule templates with common financial scenarios
   * @returns {Array} Array of rule templates
   */
  initializeTemplates() {
    return [
      {
        id: 'high_spending_alert',
        name: 'High Spending Alert',
        description: 'Get notified when you spend more than usual in a category',
        category: 'spending_monitoring',
        difficulty: 'beginner',
        icon: '💰',
        template: {
          name: 'High Spending Alert',
          type: 'spending_threshold',
          description: 'Alert me when I spend more than ${amount} on ${category}',
          conditions: {
            category: 'Food & Dining',
            amount: 200,
            period: 'monthly',
            operator: 'greater_than'
          },
          actions: {
            notify: true,
            message: 'You\'ve exceeded your ${category} spending limit of ${amount}'
          }
        },
        customizationOptions: [
          {
            key: 'category',
            label: 'Spending Category',
            type: 'select',
            options: [
              'Food & Dining',
              'Shopping',
              'Transportation',
              'Entertainment',
              'Healthcare',
              'Utilities',
              'Other'
            ],
            default: 'Food & Dining'
          },
          {
            key: 'amount',
            label: 'Amount Threshold',
            type: 'number',
            min: 10,
            max: 10000,
            step: 10,
            default: 200
          },
          {
            key: 'period',
            label: 'Time Period',
            type: 'select',
            options: [
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' }
            ],
            default: 'monthly'
          }
        ]
      },
      {
        id: 'low_balance_alert',
        name: 'Low Balance Alert',
        description: 'Get notified when your account balance drops below a threshold',
        category: 'account_monitoring',
        difficulty: 'beginner',
        icon: '🏦',
        template: {
          name: 'Low Balance Alert',
          type: 'balance_threshold',
          description: 'Alert me when my account balance drops below ${amount}',
          conditions: {
            account: 'all',
            amount: 500,
            operator: 'less_than'
          },
          actions: {
            notify: true,
            message: 'Your account balance is below ${amount}'
          }
        },
        customizationOptions: [
          {
            key: 'amount',
            label: 'Balance Threshold',
            type: 'number',
            min: 50,
            max: 10000,
            step: 50,
            default: 500
          }
        ]
      },
      {
        id: 'subscription_tracking',
        name: 'Subscription Tracking',
        description: 'Track recurring payments and get notified of changes',
        category: 'subscription_management',
        difficulty: 'intermediate',
        icon: '📱',
        template: {
          name: 'Subscription Tracking',
          type: 'recurring_payment',
          description: 'Track recurring payments to ${merchant}',
          conditions: {
            merchant: '',
            amount: 0,
            frequency: 'monthly',
            tolerance: 0.1
          },
          actions: {
            notify: true,
            message: 'Recurring payment detected: ${amount} to ${merchant}'
          }
        },
        customizationOptions: [
          {
            key: 'merchant',
            label: 'Merchant Name',
            type: 'text',
            placeholder: 'e.g., Netflix, Spotify',
            required: true
          },
          {
            key: 'amount',
            label: 'Expected Amount',
            type: 'number',
            min: 0.01,
            max: 1000,
            step: 0.01,
            default: 0
          },
          {
            key: 'frequency',
            label: 'Billing Frequency',
            type: 'select',
            options: [
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' }
            ],
            default: 'monthly'
          }
        ]
      },
      {
        id: 'income_tracking',
        name: 'Income Tracking',
        description: 'Track your income sources and get notified of deposits',
        category: 'income_monitoring',
        difficulty: 'beginner',
        icon: '💵',
        template: {
          name: 'Income Tracking',
          type: 'income_detection',
          description: 'Track income deposits from ${source}',
          conditions: {
            source: '',
            amount: 0,
            operator: 'greater_than'
          },
          actions: {
            notify: true,
            message: 'Income received: ${amount} from ${source}'
          }
        },
        customizationOptions: [
          {
            key: 'source',
            label: 'Income Source',
            type: 'text',
            placeholder: 'e.g., Employer, Freelance',
            required: true
          },
          {
            key: 'amount',
            label: 'Minimum Amount',
            type: 'number',
            min: 0.01,
            max: 100000,
            step: 0.01,
            default: 0
          }
        ]
      },
      {
        id: 'fraud_detection',
        name: 'Fraud Detection',
        description: 'Get alerted for unusual spending patterns or large transactions',
        category: 'security',
        difficulty: 'intermediate',
        icon: '🛡️',
        template: {
          name: 'Fraud Detection',
          type: 'unusual_activity',
          description: 'Alert me for unusual spending patterns',
          conditions: {
            amount: 1000,
            location: 'unusual',
            time: 'off_hours'
          },
          actions: {
            notify: true,
            message: 'Unusual activity detected: ${amount} transaction'
          }
        },
        customizationOptions: [
          {
            key: 'amount',
            label: 'Large Transaction Threshold',
            type: 'number',
            min: 100,
            max: 10000,
            step: 100,
            default: 1000
          }
        ]
      },
      {
        id: 'budget_goal',
        name: 'Budget Goal Tracking',
        description: 'Track progress toward spending or saving goals',
        category: 'goal_tracking',
        difficulty: 'intermediate',
        icon: '🎯',
        template: {
          name: 'Budget Goal Tracking',
          type: 'goal_progress',
          description: 'Track progress toward ${goal} goal',
          conditions: {
            goal: '',
            target: 0,
            current: 0,
            period: 'monthly'
          },
          actions: {
            notify: true,
            message: 'Goal progress: ${current}/${target} (${percentage}%)'
          }
        },
        customizationOptions: [
          {
            key: 'goal',
            label: 'Goal Name',
            type: 'text',
            placeholder: 'e.g., Vacation Fund, Emergency Savings',
            required: true
          },
          {
            key: 'target',
            label: 'Target Amount',
            type: 'number',
            min: 10,
            max: 100000,
            step: 10,
            default: 0
          },
          {
            key: 'period',
            label: 'Goal Period',
            type: 'select',
            options: [
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' }
            ],
            default: 'monthly'
          }
        ]
      }
    ];
  }

  /**
   * Load usage statistics from localStorage
   * @returns {Object} Usage statistics
   */
  loadUsageStats() {
    const stored = localStorage.getItem('alphaframe_template_usage');
    return stored ? JSON.parse(stored) : {
      totalUses: 0,
      templateUses: {},
      popularTemplates: [],
      lastUsed: null
    };
  }

  /**
   * Save usage statistics to localStorage
   */
  saveUsageStats() {
    localStorage.setItem('alphaframe_template_usage', JSON.stringify(this.usageStats));
  }

  /**
   * Get all available templates
   * @returns {Array} Array of all templates
   */
  getAllTemplates() {
    return this.templates;
  }

  /**
   * Get templates by category
   * @param {string} category - Template category
   * @returns {Array} Array of templates in category
   */
  getTemplatesByCategory(category) {
    return this.templates.filter(template => template.category === category);
  }

  /**
   * Get templates by difficulty level
   * @param {string} difficulty - Difficulty level (beginner, intermediate, advanced)
   * @returns {Array} Array of templates with specified difficulty
   */
  getTemplatesByDifficulty(difficulty) {
    return this.templates.filter(template => template.difficulty === difficulty);
  }

  /**
   * Get popular templates based on usage
   * @param {number} limit - Number of templates to return
   * @returns {Array} Array of popular templates
   */
  getPopularTemplates(limit = 5) {
    const sorted = this.templates.sort((a, b) => {
      const aUses = this.usageStats.templateUses[a.id] || 0;
      const bUses = this.usageStats.templateUses[b.id] || 0;
      return bUses - aUses;
    });
    
    return sorted.slice(0, limit);
  }

  /**
   * Get recently used templates
   * @param {number} limit - Number of templates to return
   * @returns {Array} Array of recently used templates
   */
  getRecentlyUsedTemplates(limit = 3) {
    if (!this.usageStats.lastUsed) {
      return [];
    }

    const recentTemplates = Object.entries(this.usageStats.lastUsed)
      .sort(([, a], [, b]) => new Date(b) - new Date(a))
      .slice(0, limit)
      .map(([id]) => this.templates.find(t => t.id === id))
      .filter(Boolean);

    return recentTemplates;
  }

  /**
   * Get template by ID
   * @param {string} id - Template ID
   * @returns {Object|null} Template object or null
   */
  getTemplateById(id) {
    return this.templates.find(template => template.id === id) || null;
  }

  /**
   * Create a rule from template with customizations
   * @param {string} templateId - Template ID
   * @param {Object} customizations - Customization values
   * @returns {Object} Generated rule object
   */
  createRuleFromTemplate(templateId, customizations = {}) {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Start with template base
    const rule = { ...template.template };

    // Apply customizations
    Object.entries(customizations).forEach(([key, value]) => {
      if (rule.conditions && rule.conditions.hasOwnProperty(key)) {
        rule.conditions[key] = value;
      }
      if (rule.actions && rule.actions.hasOwnProperty(key)) {
        rule.actions[key] = value;
      }
    });

    // Generate unique ID
    rule.id = `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Add metadata
    rule.metadata = {
      createdFromTemplate: templateId,
      createdAt: new Date().toISOString(),
      customizations
    };

    // Update usage statistics
    this.recordTemplateUsage(templateId);

    return rule;
  }

  /**
   * Record template usage for analytics
   * @param {string} templateId - Template ID
   */
  recordTemplateUsage(templateId) {
    this.usageStats.totalUses++;
    this.usageStats.templateUses[templateId] = (this.usageStats.templateUses[templateId] || 0) + 1;
    
    if (!this.usageStats.lastUsed) {
      this.usageStats.lastUsed = {};
    }
    this.usageStats.lastUsed[templateId] = new Date().toISOString();

    // Update popular templates list
    this.updatePopularTemplates();
    
    this.saveUsageStats();
  }

  /**
   * Update popular templates list
   */
  updatePopularTemplates() {
    const sorted = Object.entries(this.usageStats.templateUses)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id]) => id);
    
    this.usageStats.popularTemplates = sorted;
  }

  /**
   * Get template suggestions based on user behavior
   * @param {Object} userProfile - User profile data
   * @returns {Array} Array of suggested templates
   */
  getSuggestedTemplates(userProfile = {}) {
    const suggestions = [];

    // Suggest based on user's rule count
    const existingRules = JSON.parse(localStorage.getItem('alphaframe_user_rules') || '[]');
    
    if (existingRules.length === 0) {
      // New user - suggest beginner templates
      suggestions.push(...this.getTemplatesByDifficulty('beginner').slice(0, 3));
    } else if (existingRules.length < 3) {
      // Growing user - suggest intermediate templates
      suggestions.push(...this.getTemplatesByDifficulty('intermediate').slice(0, 2));
    } else {
      // Experienced user - suggest advanced templates
      suggestions.push(...this.getTemplatesByDifficulty('intermediate').slice(0, 2));
    }

    // Add popular templates
    const popular = this.getPopularTemplates(2);
    suggestions.push(...popular.filter(t => !suggestions.find(s => s.id === t.id)));

    // Remove duplicates and limit to 5 suggestions
    const unique = suggestions.filter((template, index, self) => 
      index === self.findIndex(t => t.id === template.id)
    );

    return unique.slice(0, 5);
  }

  /**
   * Get template categories
   * @returns {Array} Array of category objects
   */
  getCategories() {
    const categories = [
      { id: 'spending_monitoring', name: 'Spending Monitoring', icon: '💰' },
      { id: 'account_monitoring', name: 'Account Monitoring', icon: '🏦' },
      { id: 'subscription_management', name: 'Subscription Management', icon: '📱' },
      { id: 'income_monitoring', name: 'Income Tracking', icon: '💵' },
      { id: 'security', name: 'Security & Fraud', icon: '🛡️' },
      { id: 'goal_tracking', name: 'Goal Tracking', icon: '🎯' }
    ];

    return categories.map(category => ({
      ...category,
      count: this.getTemplatesByCategory(category.id).length
    }));
  }

  /**
   * Get usage statistics
   * @returns {Object} Usage statistics
   */
  getUsageStats() {
    return {
      ...this.usageStats,
      totalTemplates: this.templates.length,
      categories: this.getCategories()
    };
  }
}

// Create singleton instance
const ruleTemplateService = new RuleTemplateService();

export default ruleTemplateService; 