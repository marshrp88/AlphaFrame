# Onboarding Flow – AlphaFrame VX.1

## Purpose
The onboarding flow helps new users set up AlphaFrame quickly and confidently. It guides them through connecting their bank, reviewing transactions, setting up a budget, and choosing their dashboard view. The goal is to make the first experience smooth, helpful, and error-free.

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