# FrameSync Rules Engine – AlphaFrame VX.1

## Purpose
The FrameSync Rules Engine lets users automate financial actions and get smart, context-aware recommendations. It's designed to make financial management easier, safer, and more powerful—without needing to be a tech expert.

---

## What Does the Rules Engine Do?
- **Create rules:** Automate actions like transfers, alerts, or notifications based on your financial state
- **Edit/manage rules:** Change, enable/disable, or delete rules anytime
- **Smart suggestions:** Get recommendations for new rules based on your data
- **Audit trail:** Every rule and action is logged for transparency and trust

---

## How It Works
- **RuleBinderRoot.jsx:** Main UI for creating and editing rules
- **ActionSelector:** Choose what action to automate (transfer, webhook, memo, etc.)
- **Safeguards:** Add safety checks (confirmations, simulations)
- **Audit log:** All rule changes and executions are tracked in `ExecutionLogService`
- **Error boundaries:** Catch and display any issues without crashing the app

---

## User Experience & Error Handling
- **Step-by-step UI:** Easy to follow, with clear labels and tooltips
- **Toasts:** Show success or error messages for every action
- **Error boundaries:** Friendly error messages if something goes wrong
- **Accessible:** Keyboard navigation, readable text, color contrast

---

## How to Test or Demo
1. **Go to `/rules`** (must be logged in)
2. **Create a new rule:**
   - Click "Create Rule" and follow the prompts
   - Try different actions and safeguards
3. **Edit or delete a rule:**
   - Select an existing rule and make changes
4. **Check the audit log:**
   - See a record of all rule changes and actions
5. **Trigger errors:**
   - Try invalid configs or disconnect network to see error handling

---

## Extending or Customizing
- **Add new action types:** Update `ActionSelector` and related forms
- **Change safeguards:** Edit `Safeguards.jsx` for new safety features
- **Integrate with new services:** Add logic in `TriggerDispatcher.js`
- **Customize audit logging:** Update `ExecutionLogService.js`

---

## File Structure
- `RuleBinderRoot.jsx` – Main rules UI
- `ActionSelector.jsx`, `PlaidActionForm.jsx`, `WebhookActionForm.jsx`, etc. – Action forms
- `Safeguards.jsx` – Safety checks
- `ExecutionLogService.js` – Audit logging
- `TriggerDispatcher.js` – Executes rule actions

---

**For more details, see code comments and the main project README.** 