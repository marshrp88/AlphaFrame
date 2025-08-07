# Repo Inventory (apps/web) - Minimal Map

Purpose (10th grade): This gives us a quick map of routes, key state stores, and onboarding files so we can fix problems fast without reading the whole codebase.

## Routes (top-level)
- `/` → `pages/LandingPage.jsx`
- `/home` → `pages/Home.jsx`
- `/about` → `pages/About.jsx`
- `/dashboard` → `pages/DashboardPage.jsx`
- `/profile` → `pages/Profile.jsx` (lazy)
- `/rules` → `pages/RulesPage.jsx` (lazy)
- `/settings` → `pages/SettingsPage.jsx`
- `/onboarding` → `pages/OnboardingPage.jsx`
- `/alphapro` → `pages/AlphaPro.jsx`
- `/pro-planner` → `pages/pro/ProPlannerPage.jsx`
- `/trust` → `pages/TrustPage.jsx`
- `/test` → `pages/TestMount.jsx` (lazy)
- `*` → `pages/NotFoundPage.jsx`

Source: `src/App.jsx` route table.

## Zustand stores (key)
- `core/store/authStore.js`
  - State: `user`, `isAuthenticated`, `isLoading`, `error`, `permissions`
  - Actions: `initialize`, `register`, `login`, `logout`, `updateProfile`, `checkAuth`, `clearError`
- `store/useAppStore.js`
  - State: `isAuthenticated`, `user`, `onboardingComplete`, `isDemo`, `demoData`, `transactions`, `rules`, `triggeredRules`, `currentPage`, `dashboardMode`, `isLoading`, `error`
  - Actions: `initializeApp`, `setAuthenticated`, `setOnboardingComplete`, `enableDemo`, `disableDemo`, `setTransactions`, `setRules`, `setTriggeredRules`, `setCurrentPage`, `setDashboardMode`, getters `getTransactions/getRules/getTriggeredRules`, `shouldBypassOnboarding`, `updateUser`, `logout`
- `core/store/financialStateStore.js`
  - State: `accounts`, `transactions`, `balance`, `budget`, `goals`, `isLoading`, `isSyncing`
  - Actions: `setAccounts`, `setTransactions`, `setBalance`, `setBudget`, `setLoading`, `setSyncing`, `setAccountBalance`, `getAccountBalance`, `setGoal`, `getGoal`, `updateGoalProgress`, `recordSpending`, `resetMonthlyBudgets`, computed `getTotalBalance`, `getRecentTransactions`
- `store/modular/onboardingStore.js` (modular)
  - State: `isOnboarding`, `currentStep`, `totalSteps`, `isCompleted`, `userData`, `bankData`, `budget`, `rules`, `dashboardMode`, `validationErrors`, `stepErrors`
  - Actions: `startOnboarding`, `setCurrentStep`, `nextStep`, `previousStep`, `goToStep`, `updateUserData`, `updateBankData`, `updateBudget`, `addRule`, `removeRule`, `completeOnboarding`, `resetOnboarding`

## Onboarding files
- `pages/OnboardingPage.jsx` → orchestrates onboarding, demo bypass, redirects
- `features/onboarding/OnboardingFlow.jsx` → step sequence and UI
- `features/onboarding/steps/*` → individual steps
- `machines/onboardingMachine.js` (present) → earlier FSM artifact

## Notes
- Route guard currently implicit; we will centralize via `useRouteGuard()` as per `docs/green-path.md`.
- Demo mode flags: `sessionStorage.demo_user` and `localStorage.alphaframe_onboarding_complete` used in places.

Conclusion: This is enough to proceed with Step 2 (introduce a reliable onboarding FSM and single route guard).
