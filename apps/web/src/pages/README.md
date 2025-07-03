# Profile Page – AlphaFrame VX.1

## Purpose
The Profile page lets users view and manage their account information, roles, permissions, and session details. It's designed to give users control over their identity and security in AlphaFrame.

---

## What Does the Profile Page Do?
- **Shows user info:** Name, email, avatar, and verification status
- **Displays roles and permissions:** See what you can do in the app
- **Session management:** View and refresh your login session
- **Account actions:** Log out, manage account, or update settings
- **Security info:** See provider, user ID, and environment details

---

## How It Works
- **Loads data** from Auth0 (secure authentication)
- **Displays info** in clear, organized cards
- **Handles loading and error states** with friendly messages
- **Lets users refresh token** to see updated session info
- **Logout button** ends the session and returns to login

---

## User Experience & Error Handling
- **Loading state:** Spinner and message while loading
- **Error state:** Clear message if not authenticated or if there's a problem
- **Toasts:** Show feedback for token refresh or errors
- **Accessible:** Keyboard navigation, readable text, color contrast

---

## How to Test or Demo
1. **Login and go to `/profile`**
2. **Check user info:** Name, email, avatar, roles, permissions
3. **Refresh token:** Click "Refresh Token" and see updated info
4. **Log out:** Click "Logout" and confirm you're returned to login
5. **Trigger errors:** Log out and try to access `/profile` (should show error)

---

## Extending or Customizing
- **Add new fields:** Update the Profile component to show more info
- **Change layout:** Edit card structure or add new sections
- **Integrate with other services:** Add links to billing, notifications, etc.
- **Customize roles/permissions:** Update Auth0 config and UI

---

## File Structure
- `Profile.jsx` – Main profile page component
- Uses shared UI: `Card.jsx`, `Button.jsx`

---

**For more details, see code comments and the main project README.**

# Pages Directory - Phoenix Initiative V3.1

## Routing & Page Shells (Phase 1)

This directory contains all top-level page components for the AlphaFrame app. As of Phase 1, the following routes and page shells are scaffolded:

| Route         | Component         | Purpose                                 |
|--------------|-------------------|-----------------------------------------|
| /            | DashboardPage     | Main dashboard (redirect from /)        |
| /dashboard   | DashboardPage     | Main dashboard                          |
| /rules       | RulesPage         | Rule management and simulation          |
| /profile     | Profile           | User profile and settings               |
| /settings    | SettingsPage      | App and user settings                   |
| /onboarding  | OnboardingPage    | Onboarding flow for new users           |
| *            | NotFoundPage      | 404 fallback for unknown routes         |

All routing is handled by `AppRouter.jsx` using React Router v6. Each page shell is a minimal React component and will be expanded in future phases.

**Tech Stack:** React, vanilla JS, modular CSS only. No TypeScript, Tailwind, or Svelte.

# AlphaFrame Dashboard Flow (Institutional/CTO Level)

## Purpose
The dashboard is the central hub for all user insights, rule execution results, and automation feedback. It must always load with meaningful data, never crash, and be fully recoverable for both real and demo users.

## Canonical State Flags
- `alphaframe_onboarding_complete` (localStorage): Set to `'true'` when onboarding is complete (demo or real user).
- `demo_user` (sessionStorage): Set to `'true'` for demo/simulation mode.

## Demo vs. Real User Logic
- **Demo Mode:** If no user is authenticated, the dashboard uses high-fidelity mock data. All features are available for demo, and the dashboard is always accessible after onboarding.
- **Real User:** The dashboard uses real user data and backend calls. All state is saved and recoverable.

## Reset Process
- Use the "Full Dashboard Reset" button (top right) to clear all dashboard/demo state and restart the dashboard from scratch. This is available in all modes for QA/dev/edge-case recovery.

## Error Recovery
- If any error occurs, the dashboard will never crash or show a blank/error screen. Instead, it will redirect to onboarding or inject mock data as needed. All user-dependent logic is robust to missing/undefined user.

## QA/Dev/Leadership Notes
- All dashboard state is set and checked using canonical flags only.
- The dashboard will never load unless onboarding is complete.
- After onboarding, a refresh always lands the user on the correct screen.
- The dashboard is fully maintainable and extensible.
- A reset button is always available for QA/dev/edge-case recovery.

## Conclusion
This dashboard system is hardened to institutional standards, ensuring a perfect, fluid, and recoverable experience for every user, every time. 