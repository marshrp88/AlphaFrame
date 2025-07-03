# Phase Validation PR Template

**Template for:** All Phase 5+ PRs requiring external trigger validation  
**Enforcement:** Mandatory for core phase branches  
**Approval:** CTO or designated delegate required  

---

## 📋 **PHASE VALIDATION PR**

### **Phase Information**
- **Phase Number:** [X]
- **Phase Name:** [Phase Name]
- **Owner:** [GitHub Handle]
- **Branch:** `core/phase[X]-validated`
- **Dependencies:** [List dependent phases with ✅/❌ status]

---

## ✅ **VALIDATION CHECKLIST**

### **Pre-Validation Requirements**
- [ ] **Unit/Integration Tests:** >90% coverage achieved
- [ ] **Code Review:** All changes reviewed and approved
- [ ] **Dependencies:** All dependent phases validated
- [ ] **Branch:** Correct core phase branch used
- [ ] **Freeze Compliance:** Non-core work frozen until validation

### **External Validation Requirements**
- [ ] **External Trigger Confirmed:** Real-world validation completed
- [ ] **Real Data Validated:** Production or high-fidelity data used
- [ ] **End-to-End Tests:** Complete user journey validated
- [ ] **Performance Metrics:** All performance requirements met
- [ ] **Error Handling:** Robust error recovery verified

### **Quality Assurance Requirements**
- [ ] **Manual QA Signoff:** QA Lead approved all functionality
- [ ] **User Behavior Logging:** Real user interactions tracked
- [ ] **Documentation Updated:** All documentation current
- [ ] **Evidence Collected:** All required evidence attached
- [ ] **Governance Compliance:** All governance requirements met

---

## 📊 **EVIDENCE COLLECTION**

### **Required Evidence**
- [ ] **Test Results:** [Link to Jest/Cypress test outputs]
- [ ] **Screenshots:** [Link to real functionality screenshots]
- [ ] **Logs:** [Link to execution logs and metrics]
- [ ] **Videos:** [Link to E2E test recordings]
- [ ] **QA Signoff:** [Link to QA approval document]
- [ ] **Performance Metrics:** [Link to performance data]

### **External Trigger Evidence**
- [ ] **Real Data Source:** [Description of real data used]
- [ ] **Observable Result:** [Description of observable outcome]
- [ ] **Validation Method:** [How external trigger was validated]
- [ ] **Fallback Status:** [Whether mock fallback was used]

---

## 🎯 **EXTERNAL TRIGGER VALIDATION**

### **Validation Criteria**
```typescript
ExternalTriggerValidation.phase[X] = {
  description: "[Specific description of external trigger]",
  mockFallback: false, // Must be false for validation
  requiredEvidence: [
    "[Evidence 1]",
    "[Evidence 2]",
    "[Evidence 3]"
  ],
  observableResult: "[Specific observable result]"
}
```

### **Validation Status**
- [ ] **External Trigger:** ✅ Confirmed / ❌ Failed
- [ ] **Real Data:** ✅ Validated / ❌ Mock Used
- [ ] **Observable Result:** ✅ Achieved / ❌ Not Met
- [ ] **Evidence Complete:** ✅ All Evidence Attached / ❌ Missing Evidence

---

## 🔐 **GOVERNANCE COMPLIANCE**

### **Strategic Constraints**
- [ ] **Transparency:** All automation explainable
- [ ] **Immediacy:** Visible feedback provided
- [ ] **Actionability:** Clear next steps available
- [ ] **Privacy:** No unnecessary data exposure

### **Cross-Phase Contracts**
- [ ] **RuleExecutionResult:** Compatible with debugging, timeline, analytics
- [ ] **InsightEvent:** Compatible with timeline, analytics
- [ ] **TriggerLog:** Compatible with debugging, timeline, analytics

### **Branch Governance**
- [ ] **Correct Branch:** Using `core/phase[X]-validated` format
- [ ] **Freeze Compliance:** No UI/polish work included
- [ ] **Dependency Check:** All dependent phases validated
- [ ] **Merge Ready:** Ready for merge to main after approval

---

## 📈 **SUCCESS METRICS**

### **Functional Metrics**
- **Success Rate:** [X]% (Target: >95%)
- **Response Time:** [X]ms (Target: <[Y]ms)
- **Error Rate:** [X]% (Target: <1%)
- **User Completion:** [X]% (Target: >90%)

### **Technical Metrics**
- **Test Coverage:** [X]% (Target: >90%)
- **Performance Score:** [X] (Target: >90)
- **Accessibility Score:** [X] (Target: >90)
- **Security Score:** [X] (Target: >90)

---

## 🚨 **CONTINGENCY PLANNING**

### **If Validation Fails**
- [ ] **Root Cause Identified:** [Description of failure]
- [ ] **Mitigation Plan:** [Plan to address failure]
- [ ] **Timeline Impact:** [Impact on overall timeline]
- [ ] **Fallback Strategy:** [Alternative approach if needed]

### **If External Trigger Cannot Be Met**
- [ ] **Alternative Validation:** [Alternative validation method]
- [ ] **Risk Assessment:** [Risk of proceeding without external trigger]
- [ ] **Stakeholder Approval:** [Approval for alternative approach]
- [ ] **Documentation:** [Documentation of deviation]

---

## ✅ **APPROVAL SECTION**

### **Technical Approval**
- [ ] **Code Review:** [Reviewer Name] - Approved
- [ ] **Architecture Review:** [Reviewer Name] - Approved
- [ ] **Security Review:** [Reviewer Name] - Approved

### **Quality Assurance**
- [ ] **QA Lead:** [QA Lead Name] - Approved
- [ ] **Manual Testing:** [Tester Name] - Approved
- [ ] **Performance Testing:** [Tester Name] - Approved

### **Business Approval**
- [ ] **Product Owner:** [Product Owner Name] - Approved
- [ ] **CTO/Delegate:** [CTO/Delegate Name] - Approved

### **Final Validation**
- [ ] **External Trigger:** ✅ Confirmed by [Validator Name]
- [ ] **Real Data:** ✅ Validated by [Validator Name]
- [ ] **Governance:** ✅ Compliant with all requirements
- [ ] **Ready for Merge:** ✅ Approved for merge to main

---

## 📝 **NOTES & COMMENTS**

### **Additional Context**
[Any additional context, special considerations, or notes about this phase validation]

### **Future Considerations**
[Any considerations for future phases or improvements]

### **Lessons Learned**
[Key learnings from this phase implementation]

---

## 🔗 **RELATED DOCUMENTS**

- [Phase Validation Framework](../ALPHAFRAME_EXECUTION_GOVERNANCE_LAYER.md)
- [Phase [X] Validation Checklist](../VALIDATION_CHECKLISTS/Phase[X].md)
- [Cross-Phase Data Contracts](../../src/types/)
- [Phase Validation Registry](../../src/infra/phaseValidationRegistry.ts)

---

**This PR template ensures all phase validations meet CTO-grade requirements and maintain governance compliance across all phases.** 