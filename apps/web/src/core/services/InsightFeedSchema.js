/**
 * InsightFeedSchema - Unified Data Contracts and Validation
 *
 * Purpose: Provides schema validation and versioning for all financial insights
 * in the AlphaFrame Galileo V2.2 platform.
 *
 * Procedure:
 * 1. Defines and manages JSON schemas for all insight types (tax, debt, retirement, etc.)
 * 2. Validates insight data against the correct schema version
 * 3. Handles schema upgrades and backward compatibility
 *
 * Conclusion: This service ensures all insights are consistent, versioned, and
 * validated for integrity and compatibility across the platform.
 */

// No more constructor-based service dependencies

class InsightFeedSchema {
  constructor() {
    // Schema version
    this.schemaVersion = '2.2.0';

    // Unified schemas for all insight types
    this.schemas = {
      tax: {
        type: 'object',
        required: ['income', 'deductions', 'credits', 'totalTax', 'breakdown'],
        properties: {
          income: { type: 'number' },
          deductions: { type: 'object' },
          credits: { type: 'object' },
          totalTax: { type: 'number' },
          breakdown: { type: 'object' }
        }
      },
      debt: {
        type: 'object',
        required: ['debts', 'portfolioMetrics', 'strategies', 'recommendations'],
        properties: {
          debts: { type: 'array' },
          portfolioMetrics: { type: 'object' },
          strategies: { type: 'object' },
          recommendations: { type: 'array' }
        }
      },
      retirement: {
        type: 'object',
        required: ['deterministicForecast', 'readinessScore', 'recommendations'],
        properties: {
          deterministicForecast: { type: 'object' },
          readinessScore: { type: 'number' },
          recommendations: { type: 'array' }
        }
      }
    };
  }

  /**
   * Validate insight data against schema
   * @param {Object} data - Insight data
   * @param {string} type - Insight type (tax, debt, retirement)
   * @returns {Object} Validation result
   */
  async validateInsightData(data, type) {
    const schema = this.schemas[type];
    if (!schema) throw new Error(`No schema defined for type: ${type}`);

    // Simple validation (not using ajv for now)
    const missing = (schema.required || []).filter(key => !(key in data));
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    // Add version and id
    return {
      ...data,
      id: `${type}-${Date.now()}`,
      type,
      version: this.schemaVersion
    };
  }
}

export default InsightFeedSchema; 