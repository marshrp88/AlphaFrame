# AlphaFrame Onboarding Flow (Institutional/CTO Level)

## Purpose
This onboarding flow is designed to guarantee a seamless, error-free experience for both real and demo users. It ensures every user can complete onboarding, create a rule, and reach a working dashboard with insights—no matter what.

## Canonical State Flags
- `alphaframe_onboarding_complete` (localStorage): Set to `'true'` when onboarding is complete (demo or real user).
- `demo_user` (sessionStorage): Set to `'true'` for demo/simulation mode.

## Demo vs. Real User Logic
- **Demo Mode:** If no user is authenticated, the app uses high-fidelity mock data and always allows onboarding to complete. All steps are auto-advancing with mock data.
- **Real User:** Onboarding uses real data and backend calls. All state is saved and recoverable.

## Reset Process
- Use the "Full Onboarding Reset" button (top right) to clear all onboarding/demo state and restart the flow from scratch. This is available in all modes for QA/dev/edge-case recovery.

## Error Recovery
- If any error occurs during onboarding, a clear error message and a "Restart Onboarding" button are shown. The app never gets stuck in an unrecoverable state.

## QA/Dev/Leadership Notes
- All onboarding state is set and checked using canonical flags only.
- The dashboard will never load unless onboarding is complete.
- After onboarding, a refresh always lands the user on the correct screen.
- All user-dependent logic is robust to missing/undefined user.
- The onboarding flow is fully maintainable and extensible.

## Conclusion
This onboarding system is hardened to institutional standards, ensuring a perfect, fluid, and recoverable experience for every user, every time.

---

## How It Works (Step-by-Step)
1. **Connect Your Bank**
   - Secure Plaid integration
   - User sees benefits and security info
   - Handles connection errors with friendly messages
2. **Review Transactions**
   - User reviews and categorizes recent transactions
   - Can skip or retry if data fails to load
3. **Set Up Budget**
   - User creates first budget categories and limits
   - Visual feedback and progress tracking
4. **Choose Dashboard Mode**
   - User picks their preferred dashboard style (Overview, Analytics, Planning, Automation)
   - Can skip and change later

---

## User Experience & Error Handling
- **Progress bar** and step indicators show where the user is
- **Toasts** and messages confirm each step or show errors
- **Skip** options for non-required steps
- **Loading states** and retry buttons for network issues
- **Accessible**: keyboard navigation, clear focus, readable text

---

## How to Test or Demo
1. **Start fresh:** Clear browser localStorage or use a new user
2. **Go to `/onboarding`** (or let the app redirect you as a new user)
3. **Complete each step:**
   - Try both success and error paths (e.g., fail Plaid connection, skip a step)
   - Watch for toasts and error messages
4. **Finish onboarding:**
   - Should redirect to dashboard with a welcome message
5. **Repeat:** You can reset and try again to demo different flows

---

## Extending or Customizing
- **Add new steps:** Edit `ONBOARDING_STEPS` in `OnboardingFlow.jsx`
- **Change step order or requirements:** Update the step config
- **Customize UI:** Edit step components in `/steps/`
- **Integrate analytics:** Use hooks in each step to log events

---

## File Structure
- `OnboardingFlow.jsx` – Main controller
- `/steps/` – Each step as its own component
- `Progress.jsx`, `Card.jsx`, `Button.jsx` – Shared UI

---

**For more details, see code comments and the main project README.** 