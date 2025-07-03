/**
 * Phase Validation Registry - CTO-Grade Execution Governance
 * 
 * Purpose: Central registry for all phase validation status, ownership, and enforcement
 * across AlphaFrame's 14-phase critical path to customer readiness.
 * 
 * This registry must be referenced in all PRs and deployment logs to ensure
 * no phase is marked complete without proper external validation.
 */

export interface PhaseValidationStatus {
  phase: number;
  name: string;
  owner: string;
  branch: string;
  status: 'pending' | 'in-progress' | 'validated' | 'failed';
  externalTriggerValidated: boolean;
  realDataValidated: boolean;
  qaApproved: boolean;
  userBehaviorLogged: boolean;
  documentationUpdated: boolean;
  testCoverage: number; // percentage
  lastValidated: string;
  validationEvidence: string[]; // URLs to evidence
  dependencies: number[]; // dependent phases
  contingencyPlan?: string;
}

export interface ValidationContract {
  externalTrigger: {
    description: string;
    mockFallback: boolean;
    requiredEvidence: string[];
    observableResult: string;
  };
  realData: {
    description: string;
    dataSource: string;
    validationMethod: string;
  };
  qaApproval: {
    required: boolean;
    signoffBy: string;
    criteria: string[];
  };
  userBehaviorLogging: {
    events: string[];
    metrics: string[];
    retention: string;
  };
}

// AlphaFrame Strategic Constraint
export const ALPHAFRAME_STRATEGIC_CONSTRAINT = {
  transparency: 'All user-facing automation must be explainable (transparent triggers)',
  immediacy: 'All user-facing automation must provide immediate visible feedback',
  actionability: 'All user-facing automation must provide clear next steps or insights',
  privacy: 'All user-facing automation must avoid unnecessary third-party data exposure'
};

// Phase Validation Registry
export const PHASE_VALIDATION_REGISTRY: Record<number, PhaseValidationStatus> = {
  0: {
    phase: 0,
    name: 'Foundation & Design System Hardening',
    owner: 'Design System Lead',
    branch: 'core/phase0-validated',
    status: 'validated',
    externalTriggerValidated: true,
    realDataValidated: true,
    qaApproved: true,
    userBehaviorLogged: false,
    documentationUpdated: true,
    testCoverage: 95,
    lastValidated: '2025-01-30',
    validationEvidence: ['design-tokens.css', 'component-showcase.html'],
    dependencies: []
  },
  1: {
    phase: 1,
    name: 'Functional Rule Execution Layer',
    owner: 'Backend Lead',
    branch: 'core/phase1-validated',
    status: 'validated',
    externalTriggerValidated: true,
    realDataValidated: true,
    qaApproved: true,
    userBehaviorLogged: true,
    documentationUpdated: true,
    testCoverage: 90,
    lastValidated: '2025-01-30',
    validationEvidence: ['RuleExecutionEngine.test.js', 'rule-execution-logs.json'],
    dependencies: [0]
  },
  2: {
    phase: 2,
    name: 'Dynamic Rule-Based Insights',
    owner: 'Frontend Lead',
    branch: 'core/phase2-validated',
    status: 'validated',
    externalTriggerValidated: true,
    realDataValidated: true,
    qaApproved: true,
    userBehaviorLogged: true,
    documentationUpdated: true,
    testCoverage: 88,
    lastValidated: '2025-01-30',
    validationEvidence: ['DynamicInsightCard.jsx', 'dashboard-insights.json'],
    dependencies: [0, 1]
  },
  3: {
    phase: 3,
    name: 'Automation Feedback Layer',
    owner: 'UX Lead',
    branch: 'core/phase3-validated',
    status: 'validated',
    externalTriggerValidated: true,
    realDataValidated: true,
    qaApproved: true,
    userBehaviorLogged: true,
    documentationUpdated: true,
    testCoverage: 92,
    lastValidated: '2025-01-30',
    validationEvidence: ['use-toast.jsx', 'automation-feedback-logs.json'],
    dependencies: [0, 1, 2]
  },
  4: {
    phase: 4,
    name: 'Onboarding Automation Education',
    owner: 'Product Lead',
    branch: 'core/phase4-validated',
    status: 'validated',
    externalTriggerValidated: true,
    realDataValidated: true,
    qaApproved: true,
    userBehaviorLogged: true,
    documentationUpdated: true,
    testCoverage: 85,
    lastValidated: '2025-01-30',
    validationEvidence: ['OnboardingFlow.jsx', 'onboarding-completion-logs.json'],
    dependencies: [0, 1, 2, 3]
  },
  5: {
    phase: 5,
    name: 'Plaid Production Integration',
    owner: 'Auth/Bank Integration Lead',
    branch: 'core/phase5-validated',
    status: 'pending',
    externalTriggerValidated: false,
    realDataValidated: false,
    qaApproved: false,
    userBehaviorLogged: false,
    documentationUpdated: false,
    testCoverage: 0,
    lastValidated: '',
    validationEvidence: [],
    dependencies: [0, 1, 2, 3, 4],
    contingencyPlan: 'Fallback to Phase 6: Simulation Mode v1 if Plaid fails after 14 days'
  },
  6: {
    phase: 6,
    name: 'Simulation Mode',
    owner: 'Data Lead',
    branch: 'core/phase6-validated',
    status: 'pending',
    externalTriggerValidated: false,
    realDataValidated: false,
    qaApproved: false,
    userBehaviorLogged: false,
    documentationUpdated: false,
    testCoverage: 0,
    lastValidated: '',
    validationEvidence: [],
    dependencies: [0, 1, 2, 3, 4, 5]
  },
  7: {
    phase: 7,
    name: 'Rule Debugging Console',
    owner: 'Backend Lead',
    branch: 'core/phase7-validated',
    status: 'pending',
    externalTriggerValidated: false,
    realDataValidated: false,
    qaApproved: false,
    userBehaviorLogged: false,
    documentationUpdated: false,
    testCoverage: 0,
    lastValidated: '',
    validationEvidence: [],
    dependencies: [0, 1, 2, 3, 4, 5, 6]
  },
  8: {
    phase: 8,
    name: 'Pro Feature Gating',
    owner: 'Product Lead',
    branch: 'core/phase8-validated',
    status: 'pending',
    externalTriggerValidated: false,
    realDataValidated: false,
    qaApproved: false,
    userBehaviorLogged: false,
    documentationUpdated: false,
    testCoverage: 0,
    lastValidated: '',
    validationEvidence: [],
    dependencies: [0, 1, 2, 3, 4, 5, 6, 7]
  },
  9: {
    phase: 9,
    name: 'End-to-End Success Scenarios',
    owner: 'QA Lead',
    branch: 'core/phase9-e2e-path',
    status: 'pending',
    externalTriggerValidated: false,
    realDataValidated: false,
    qaApproved: false,
    userBehaviorLogged: false,
    documentationUpdated: false,
    testCoverage: 0,
    lastValidated: '',
    validationEvidence: [],
    dependencies: [0, 1, 2, 3, 4, 5, 6, 7, 8]
  },
  10: {
    phase: 10,
    name: 'UI Polish Gating',
    owner: 'Design Lead',
    branch: 'core/phase10-validated',
    status: 'pending',
    externalTriggerValidated: false,
    realDataValidated: false,
    qaApproved: false,
    userBehaviorLogged: false,
    documentationUpdated: false,
    testCoverage: 0,
    lastValidated: '',
    validationEvidence: [],
    dependencies: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  },
  11: {
    phase: 11,
    name: 'Timeline Interaction Layer',
    owner: 'Frontend Lead',
    branch: 'core/phase11-validated',
    status: 'pending',
    externalTriggerValidated: false,
    realDataValidated: false,
    qaApproved: false,
    userBehaviorLogged: false,
    documentationUpdated: false,
    testCoverage: 0,
    lastValidated: '',
    validationEvidence: [],
    dependencies: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  12: {
    phase: 12,
    name: 'UX Baseline KPIs',
    owner: 'Analytics Lead',
    branch: 'core/phase12-validated',
    status: 'pending',
    externalTriggerValidated: false,
    realDataValidated: false,
    qaApproved: false,
    userBehaviorLogged: false,
    documentationUpdated: false,
    testCoverage: 0,
    lastValidated: '',
    validationEvidence: [],
    dependencies: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  },
  13: {
    phase: 13,
    name: 'A/B Testing & Feedback',
    owner: 'Analytics Lead',
    branch: 'core/phase13-validated',
    status: 'pending',
    externalTriggerValidated: false,
    realDataValidated: false,
    qaApproved: false,
    userBehaviorLogged: false,
    documentationUpdated: false,
    testCoverage: 0,
    lastValidated: '',
    validationEvidence: [],
    dependencies: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  14: {
    phase: 14,
    name: 'Robust Error Handling',
    owner: 'Backend Lead',
    branch: 'core/phase14-validated',
    status: 'pending',
    externalTriggerValidated: false,
    realDataValidated: false,
    qaApproved: false,
    userBehaviorLogged: false,
    documentationUpdated: false,
    testCoverage: 0,
    lastValidated: '',
    validationEvidence: [],
    dependencies: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  }
};

// Validation Contracts for each phase
export const VALIDATION_CONTRACTS: Record<number, ValidationContract> = {
  5: {
    externalTrigger: {
      description: 'Rule fires against a real transaction fetched via Plaid production API',
      mockFallback: false,
      requiredEvidence: ['Cypress E2E video', 'Plaid transaction logs', 'Dashboard insight screenshot'],
      observableResult: 'ruleExecutionLogs include PlaidTX:<transactionId> and dashboard insight updates in real time'
    },
    realData: {
      description: 'Real bank account connected and transactions synced via Plaid',
      dataSource: 'Plaid Production API',
      validationMethod: 'OAuth flow completion and transaction sync verification'
    },
    qaApproval: {
      required: true,
      signoffBy: 'QA Lead',
      criteria: ['OAuth flow works', 'Transactions sync reliably', 'Rules evaluate against real data', 'No data loss during sync']
    },
    userBehaviorLogging: {
      events: ['plaid_connection_attempted', 'plaid_connection_successful', 'transaction_sync_started', 'transaction_sync_completed', 'rule_evaluated_against_real_data'],
      metrics: ['connection_success_rate', 'sync_completion_time', 'rule_trigger_rate'],
      retention: '90 days'
    }
  },
  9: {
    externalTrigger: {
      description: 'Complete user journey: onboarding → rule creation → trigger → insight → simulated decision',
      mockFallback: false,
      requiredEvidence: ['Full user journey video', 'User feedback logs', 'Success metrics dashboard'],
      observableResult: 'User completes full automation workflow without dead ends or broken flows'
    },
    realData: {
      description: 'End-to-end user journey with real or high-fidelity mock data',
      dataSource: 'User interaction logs and system state',
      validationMethod: 'User journey testing and success rate measurement'
    },
    qaApproval: {
      required: true,
      signoffBy: 'QA Lead',
      criteria: ['No dead ends in user flows', 'Clear next steps at every action', 'Complete automation workflows', 'User value delivery confirmed']
    },
    userBehaviorLogging: {
      events: ['onboarding_started', 'onboarding_completed', 'rule_created', 'rule_triggered', 'insight_generated', 'user_action_taken'],
      metrics: ['onboarding_completion_rate', 'rule_creation_success_rate', 'time_to_first_insight', 'user_journey_completion_rate'],
      retention: '180 days'
    }
  }
};

// Governance Functions
export function isPhaseValidated(phase: number): boolean {
  const phaseStatus = PHASE_VALIDATION_REGISTRY[phase];
  return phaseStatus?.status === 'validated' && 
         phaseStatus.externalTriggerValidated && 
         phaseStatus.realDataValidated && 
         phaseStatus.qaApproved;
}

export function canProceedToPhase(targetPhase: number): boolean {
  const phaseStatus = PHASE_VALIDATION_REGISTRY[targetPhase];
  if (!phaseStatus) return false;
  
  // Check all dependencies are validated
  return phaseStatus.dependencies.every(dep => isPhaseValidated(dep));
}

export function getPhaseDependencies(phase: number): number[] {
  return PHASE_VALIDATION_REGISTRY[phase]?.dependencies || [];
}

export function updatePhaseStatus(
  phase: number, 
  updates: Partial<PhaseValidationStatus>
): void {
  if (PHASE_VALIDATION_REGISTRY[phase]) {
    PHASE_VALIDATION_REGISTRY[phase] = {
      ...PHASE_VALIDATION_REGISTRY[phase],
      ...updates,
      lastValidated: new Date().toISOString()
    };
  }
}

export function getValidationContract(phase: number): ValidationContract | null {
  return VALIDATION_CONTRACTS[phase] || null;
}

// Branch Governance
export function getRequiredBranch(phase: number): string {
  return PHASE_VALIDATION_REGISTRY[phase]?.branch || `core/phase${phase}-validated`;
}

export function isCorePhaseBranch(branch: string): boolean {
  return branch.startsWith('core/phase') && branch.includes('-validated');
}

export function canMergeToMain(branch: string): boolean {
  // Only core phase branches that are validated can merge to main
  if (!isCorePhaseBranch(branch)) return false;
  
  // Extract phase number from branch name
  const phaseMatch = branch.match(/phase(\d+)/);
  if (!phaseMatch) return false;
  
  const phaseNumber = parseInt(phaseMatch[1]);
  return isPhaseValidated(phaseNumber);
}

// Export for use in CI/CD and PR validation
export default {
  PHASE_VALIDATION_REGISTRY,
  VALIDATION_CONTRACTS,
  isPhaseValidated,
  canProceedToPhase,
  getPhaseDependencies,
  updatePhaseStatus,
  getValidationContract,
  getRequiredBranch,
  isCorePhaseBranch,
  canMergeToMain,
  ALPHAFRAME_STRATEGIC_CONSTRAINT
}; 